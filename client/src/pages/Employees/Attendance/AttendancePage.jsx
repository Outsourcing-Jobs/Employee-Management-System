import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CheckCircle2, XCircle, LogIn, LogOut,
  CalendarDays, ChevronLeft, ChevronRight,
  Timer, TrendingUp, AlertCircle, Coffee
} from 'lucide-react';
import { HandleUpdateAttendance, HandleGetMyAttendance } from '../../../redux/Thunks/AttendanceThunk';
import { toast } from '../../../hooks/use-toast';

const MONTHS_VI = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
  'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
  'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

const DAYS_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const STATUS_CONFIG = {
  Present: {
    label: 'Có mặt',
    color: 'bg-green-100 text-green-700 border-green-200',
    dot: 'bg-green-500',
    icon: <CheckCircle2 size={14} />,
  },
  Absent: {
    label: 'Vắng mặt',
    color: 'bg-red-100 text-red-700 border-red-200',
    dot: 'bg-red-500',
    icon: <XCircle size={14} />,
  },
  'Half Day': {
    label: 'Nửa ngày',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    dot: 'bg-yellow-500',
    icon: <Coffee size={14} />,
  },
  'Not Specified': {
    label: 'Chưa xác định',
    color: 'bg-slate-100 text-slate-500 border-slate-200',
    dot: 'bg-slate-400',
    icon: <AlertCircle size={14} />,
  },
};

const AttendancePage = () => {
  const dispatch = useDispatch();
  const hasFetched = useRef(false);

  const { myAttendance, isLoading: attendanceLoading } = useSelector(
    (state) => state.AttendanceReducer || {}
  );
  const employee = useSelector(
    (state) => state.HREmployeesPageReducer?.employeeData?.data || null
  );

  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentTime, setCurrentTime] = useState(new Date());

  // Đồng hồ - cập nhật mỗi giây
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch lịch sử chấm công - CHỈ 1 LẦN khi mount
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(HandleGetMyAttendance());
    }
  }, [dispatch]);

  // Parse attendance logs từ response
  // API: { data: [{ attendancelog: [...] }] }
  // Slice: myAttendance = data[0] = { attendancelog: [...] }
  const attendanceLogs = useMemo(() => {
    if (!myAttendance) return [];
    if (Array.isArray(myAttendance.attendancelog)) {
      return myAttendance.attendancelog;
    }
    if (Array.isArray(myAttendance)) {
      return myAttendance;
    }
    return [];
  }, [myAttendance]);

  // Tìm log hôm nay
  const todayLog = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return attendanceLogs.find((log) => {
      const logDate = new Date(log.logdate);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === today.getTime();
    });
  }, [attendanceLogs]);

  const hasCheckedIn = !!todayLog?.checkInTime;
  const hasCheckedOut = !!todayLog?.checkOutTime;

  // Thời gian làm việc hôm nay - chỉ tính khi cần, không gây re-render toàn bộ
  const todayWorkHours = useMemo(() => {
    if (!todayLog?.checkInTime) return null;
    const checkIn = new Date(todayLog.checkInTime);
    const end = todayLog.checkOutTime ? new Date(todayLog.checkOutTime) : currentTime;
    const diff = end - checkIn;
    return {
      hours: Math.floor(diff / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
    };
  }, [todayLog, currentTime]);

  // Stats tháng hiện tại
  const monthStats = useMemo(() => {
    const stats = { present: 0, absent: 0, halfDay: 0, totalHours: 0 };
    attendanceLogs.forEach((log) => {
      const logDate = new Date(log.logdate);
      if (logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear) {
        if (log.logstatus === 'Present') stats.present++;
        else if (log.logstatus === 'Absent') stats.absent++;
        else if (log.logstatus === 'Half Day') stats.halfDay++;
        if (log.checkInTime && log.checkOutTime) {
          stats.totalHours += (new Date(log.checkOutTime) - new Date(log.checkInTime)) / 3600000;
        }
      }
    });
    return stats;
  }, [attendanceLogs, currentMonth, currentYear]);

  // Calendar data
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startPad = firstDay.getDay();
    const days = [];
    for (let i = 0; i < startPad; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(currentYear, currentMonth, d);
      date.setHours(0, 0, 0, 0);
      const log = attendanceLogs.find((l) => {
        const ld = new Date(l.logdate);
        ld.setHours(0, 0, 0, 0);
        return ld.getTime() === date.getTime();
      });
      days.push({ date, day: d, log });
    }
    return days;
  }, [currentMonth, currentYear, attendanceLogs]);

  // === HANDLERS ===
  const handleCheckInOut = async () => {
    setIsCheckingIn(true);
    try {
      await dispatch(HandleUpdateAttendance({
        currentdate: new Date().toISOString(),
      })).unwrap();
      toast({
        title: 'Thành công',
        description: hasCheckedIn ? 'Check-out thành công!' : 'Check-in thành công!',
      });
      // Refetch sau khi check-in/out
      dispatch(HandleGetMyAttendance());
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: err?.message || 'Chấm công thất bại',
      });
    } finally {
      setIsCheckingIn(false);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    return new Date(dateString).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  // === LOADING ===
  if (attendanceLoading && !myAttendance) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3">
        <div className="w-10 h-10 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        <p className="font-semibold text-blue-600">Đang tải lịch sử chấm công...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Chấm công</h1>
          {employee && (
            <p className="mt-1 text-sm text-slate-500">
              Xin chào, {employee.firstname} {employee.lastname}
            </p>
          )}
        </div>

        {/* CHECK-IN/OUT CARD */}
        <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <div className="text-center text-white md:text-left">
              <p className="text-sm font-medium opacity-80">
                {currentTime.toLocaleDateString('vi-VN', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
              <p className="mt-1 text-5xl font-bold tabular-nums">
                {currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
              {todayWorkHours && (
                <p className="flex items-center gap-1.5 mt-2 text-sm opacity-80">
                  <Timer size={14} />
                  Đã làm: {todayWorkHours.hours}h {todayWorkHours.minutes}m
                </p>
              )}
            </div>

            <div className="flex flex-col items-center gap-3">
              {hasCheckedIn && hasCheckedOut ? (
                <div className="flex flex-col items-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <CheckCircle2 size={32} className="text-green-300" />
                  <p className="text-sm font-semibold text-white">Đã hoàn thành hôm nay</p>
                  <div className="flex gap-4 text-xs text-white/80">
                    <span>Vào: {formatTime(todayLog?.checkInTime)}</span>
                    <span>Ra: {formatTime(todayLog?.checkOutTime)}</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleCheckInOut}
                  disabled={isCheckingIn}
                  className={`flex items-center gap-3 px-8 py-4 font-bold text-lg rounded-2xl transition-all shadow-xl disabled:opacity-50 ${
                    hasCheckedIn
                      ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/30'
                      : 'bg-white hover:bg-slate-50 text-blue-700 shadow-white/30'
                  }`}
                >
                  {isCheckingIn ? (
                    <div className="w-6 h-6 border-current rounded-full border-3 border-t-transparent animate-spin"></div>
                  ) : hasCheckedIn ? (
                    <LogOut size={24} />
                  ) : (
                    <LogIn size={24} />
                  )}
                  {isCheckingIn ? 'Đang xử lý...' : hasCheckedIn ? 'Check-out' : 'Check-in'}
                </button>
              )}
              {hasCheckedIn && !hasCheckedOut && (
                <p className="text-xs text-white/70">Check-in lúc: {formatTime(todayLog?.checkInTime)}</p>
              )}
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Có mặt" value={monthStats.present} icon={<CheckCircle2 size={20} />} color="green" />
          <StatCard label="Vắng mặt" value={monthStats.absent} icon={<XCircle size={20} />} color="red" />
          <StatCard label="Nửa ngày" value={monthStats.halfDay} icon={<Coffee size={20} />} color="yellow" />
          <StatCard label="Tổng giờ" value={`${Math.round(monthStats.totalHours)}h`} icon={<TrendingUp size={20} />} color="blue" />
        </div>

        {/* CALENDAR */}
        <div className="overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <button onClick={prevMonth} className="p-2 transition-colors rounded-xl hover:bg-slate-100 text-slate-500">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-bold text-slate-800">
              {MONTHS_VI[currentMonth]} {currentYear}
            </h2>
            <button onClick={nextMonth} className="p-2 transition-colors rounded-xl hover:bg-slate-100 text-slate-500">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS_VI.map((day) => (
                <div key={day} className="py-2 text-xs font-bold tracking-wider text-center uppercase text-slate-400">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((item, idx) => {
                if (!item) return <div key={`pad-${idx}`} className="p-2 aspect-square"></div>;
                const { date, day, log } = item;
                const today = isToday(date);
                const config = log ? STATUS_CONFIG[log.logstatus] || STATUS_CONFIG['Not Specified'] : null;
                const isFuture = date > new Date();
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                return (
                  <div
                    key={day}
                    className={`relative p-1.5 rounded-xl text-center transition-all cursor-default min-h-[60px] flex flex-col items-center justify-center gap-0.5 ${
                      today ? 'ring-2 ring-blue-500 bg-blue-50'
                        : isFuture ? 'bg-slate-50/50'
                        : log ? 'hover:bg-slate-50'
                        : isWeekend ? 'bg-slate-50/30' : ''
                    }`}
                  >
                    <span className={`text-sm font-semibold ${
                      today ? 'text-blue-600' : isFuture ? 'text-slate-300' : isWeekend ? 'text-slate-400' : 'text-slate-700'
                    }`}>{day}</span>
                    {config && <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>}
                    {log?.checkInTime && (
                      <span className="text-[9px] text-slate-400 hidden sm:block">
                        {formatTime(log.checkInTime)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 px-6 py-3 border-t border-slate-100 bg-slate-50">
            {Object.entries(STATUS_CONFIG).map(([key, val]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${val.dot}`}></div>
                <span className="text-xs font-medium text-slate-500">{val.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* LỊCH SỬ CHẤM CÔNG */}
        <div className="overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">Lịch sử chấm công</h3>
            <span className="px-3 py-1 text-xs font-bold text-blue-600 rounded-full bg-blue-50">
              {attendanceLogs.length} bản ghi
            </span>
          </div>

          {attendanceLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <CalendarDays size={48} className="mb-3 text-slate-300" />
              <p className="font-semibold text-slate-500">Chưa có dữ liệu chấm công</p>
              <p className="mt-1 text-sm text-slate-400">Nhấn "Check-in" để bắt đầu</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-slate-50 border-slate-100">
                    <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Ngày</th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Trạng thái</th>
                    <th className="px-5 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Giờ vào</th>
                    <th className="px-5 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Giờ ra</th>
                    <th className="px-5 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-slate-500 hidden sm:table-cell">Tổng giờ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[...attendanceLogs]
                    .sort((a, b) => new Date(b.logdate) - new Date(a.logdate))
                    .map((log, idx) => {
                      const config = STATUS_CONFIG[log.logstatus] || STATUS_CONFIG['Not Specified'];
                      const workHours =
                        log.checkInTime && log.checkOutTime
                          ? ((new Date(log.checkOutTime) - new Date(log.checkInTime)) / 3600000).toFixed(1)
                          : null;
                      const logIsToday = isToday(new Date(log.logdate));

                      return (
                        <tr
                          key={log._id || idx}
                          className={`transition-colors hover:bg-slate-50 ${logIsToday ? 'bg-blue-50/30' : ''}`}
                        >
                          {/* Ngày */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-slate-100">
                                <span className="text-sm font-bold leading-none text-slate-700">
                                  {new Date(log.logdate).getDate()}
                                </span>
                                <span className="text-[9px] font-semibold uppercase text-slate-400 leading-none mt-0.5">
                                  {new Date(log.logdate).toLocaleDateString('vi-VN', { month: 'short' })}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-700">
                                  {formatDate(log.logdate)}
                                </p>
                                {logIsToday && (
                                  <span className="text-[10px] font-bold text-blue-600 uppercase">Hôm nay</span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Trạng thái */}
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
                              {config.icon} {config.label}
                            </span>
                          </td>

                          {/* Giờ vào */}
                          <td className="px-5 py-3.5 text-center">
                            {log.checkInTime ? (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50">
                                <LogIn size={12} className="text-green-500" />
                                <span className="text-sm font-semibold text-green-700">
                                  {formatTime(log.checkInTime)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-slate-300">--:--</span>
                            )}
                          </td>

                          {/* Giờ ra */}
                          <td className="px-5 py-3.5 text-center">
                            {log.checkOutTime ? (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50">
                                <LogOut size={12} className="text-orange-500" />
                                <span className="text-sm font-semibold text-orange-700">
                                  {formatTime(log.checkOutTime)}
                                </span>
                              </div>
                            ) : log.checkInTime ? (
                              <span className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-yellow-50 text-yellow-600">
                                Đang làm...
                              </span>
                            ) : (
                              <span className="text-sm text-slate-300">--:--</span>
                            )}
                          </td>

                          {/* Tổng giờ */}
                          <td className="hidden px-5 py-3.5 text-center sm:table-cell">
                            {workHours ? (
                              <span className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-50 text-blue-600">
                                {workHours}h
                              </span>
                            ) : log.checkInTime && !log.checkOutTime ? (
                              <span className="text-xs text-slate-400">...</span>
                            ) : (
                              <span className="text-sm text-slate-300">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color }) => {
  const colors = {
    green: 'bg-green-50 text-green-600 border-green-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
  };
  return (
    <div className={`p-4 border rounded-2xl ${colors[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold tracking-wider uppercase opacity-70">{label}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
        <div className="opacity-50">{icon}</div>
      </div>
    </div>
  );
};

export default AttendancePage;