import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Clock, CheckCircle2, XCircle, LogIn, LogOut,
  CalendarDays, ChevronLeft, ChevronRight,
  Timer, TrendingUp, AlertCircle, Coffee
} from 'lucide-react';
import { HandleUpdateAttendance } from '../../../redux/Thunks/AttendanceThunk';
import { HandleGetMyProfile } from '../../../redux/Thunks/HREmployeesThunk';
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

  const employee = useSelector(
    (state) => state.HREmployeesPageReducer?.employeeData?.data || null
  );

  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentTime, setCurrentTime] = useState(new Date());

  // Cập nhật đồng hồ mỗi giây
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch profile nếu chưa có
  useEffect(() => {
    if (!employee) {
      dispatch(HandleGetMyProfile());
    }
  }, [dispatch, employee]);

  // Lấy attendance logs
  const attendanceLogs = useMemo(() => {
    if (!employee?.attendance) return [];
    if (typeof employee.attendance === 'object' && employee.attendance.attendancelog) {
      return employee.attendance.attendancelog;
    }
    return [];
  }, [employee]);

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

  // Trạng thái check-in/out
  const hasCheckedIn = !!todayLog?.checkInTime;
  const hasCheckedOut = !!todayLog?.checkOutTime;

  // Tính thời gian làm việc hôm nay
  const todayWorkHours = useMemo(() => {
    if (!todayLog?.checkInTime) return null;
    const checkIn = new Date(todayLog.checkInTime);
    const checkOut = todayLog.checkOutTime ? new Date(todayLog.checkOutTime) : new Date();
    const diff = checkOut - checkIn;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return { hours, minutes, total: diff };
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
          const diff = new Date(log.checkOutTime) - new Date(log.checkInTime);
          stats.totalHours += diff / 3600000;
        }
      }
    });
    return stats;
  }, [attendanceLogs, currentMonth, currentYear]);

  // Tạo calendar data
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startPad = firstDay.getDay();
    const days = [];

    // Padding đầu tháng
    for (let i = 0; i < startPad; i++) {
      days.push(null);
    }

    // Ngày trong tháng
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
      dispatch(HandleGetMyProfile());
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
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // === LOADING ===
  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3">
        <div className="w-10 h-10 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        <p className="font-semibold text-blue-600">Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto space-y-6 max-w-8xl">

        {/* === HEADER === */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Chấm công</h1>
          <p className="mt-1 text-sm text-slate-500">
            Xin chào, {employee.firstname} {employee.lastname}
          </p>
        </div>

        {/* === CHECK-IN/OUT CARD === */}
        <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            {/* Đồng hồ */}
            <div className="text-center text-white md:text-left">
              <p className="text-sm font-medium opacity-80">
                {currentTime.toLocaleDateString('vi-VN', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
              <p className="mt-1 text-5xl font-bold tabular-nums">
                {currentTime.toLocaleTimeString('vi-VN', {
                  hour: '2-digit', minute: '2-digit', second: '2-digit',
                })}
              </p>
              {todayWorkHours && (
                <p className="flex items-center gap-1.5 mt-2 text-sm opacity-80">
                  <Timer size={14} />
                  Đã làm: {todayWorkHours.hours}h {todayWorkHours.minutes}m
                </p>
              )}
            </div>

            {/* Nút check-in/out */}
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
                  {isCheckingIn
                    ? 'Đang xử lý...'
                    : hasCheckedIn
                      ? 'Check-out'
                      : 'Check-in'}
                </button>
              )}

              {/* Thời gian check-in hôm nay */}
              {hasCheckedIn && !hasCheckedOut && (
                <p className="text-xs text-white/70">
                  Check-in lúc: {formatTime(todayLog?.checkInTime)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* === STATS === */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="Có mặt"
            value={monthStats.present}
            icon={<CheckCircle2 size={20} />}
            color="green"
          />
          <StatCard
            label="Vắng mặt"
            value={monthStats.absent}
            icon={<XCircle size={20} />}
            color="red"
          />
          <StatCard
            label="Nửa ngày"
            value={monthStats.halfDay}
            icon={<Coffee size={20} />}
            color="yellow"
          />
          <StatCard
            label="Tổng giờ"
            value={`${Math.round(monthStats.totalHours)}h`}
            icon={<TrendingUp size={20} />}
            color="blue"
          />
        </div>

        {/* === CALENDAR === */}
        <div className="overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-200">
          {/* Calendar header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <button
              onClick={prevMonth}
              className="p-2 transition-colors rounded-xl hover:bg-slate-100 text-slate-500"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-bold text-slate-800">
              {MONTHS_VI[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 transition-colors rounded-xl hover:bg-slate-100 text-slate-500"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Calendar grid */}
          <div className="p-4">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS_VI.map((day) => (
                <div
                  key={day}
                  className="py-2 text-xs font-bold tracking-wider text-center uppercase text-slate-400"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((item, idx) => {
                if (!item) {
                  return <div key={`pad-${idx}`} className="p-2 aspect-square"></div>;
                }

                const { date, day, log } = item;
                const today = isToday(date);
                const config = log ? STATUS_CONFIG[log.logstatus] || STATUS_CONFIG['Not Specified'] : null;
                const isFuture = date > new Date();
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                return (
                  <div
                    key={day}
                    className={`relative p-1.5 rounded-xl text-center transition-all cursor-default min-h-[60px] flex flex-col items-center justify-center gap-0.5 ${
                      today
                        ? 'ring-2 ring-blue-500 bg-blue-50'
                        : isFuture
                          ? 'bg-slate-50/50'
                          : log
                            ? 'hover:bg-slate-50'
                            : isWeekend
                              ? 'bg-slate-50/30'
                              : ''
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold ${
                        today
                          ? 'text-blue-600'
                          : isFuture
                            ? 'text-slate-300'
                            : isWeekend
                              ? 'text-slate-400'
                              : 'text-slate-700'
                      }`}
                    >
                      {day}
                    </span>
                    {config && (
                      <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>
                    )}
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

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 px-6 py-3 border-t border-slate-100 bg-slate-50">
            {Object.entries(STATUS_CONFIG).map(([key, val]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${val.dot}`}></div>
                <span className="text-xs font-medium text-slate-500">{val.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* === RECENT LOGS === */}
        <div className="overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">Lịch sử chấm công gần đây</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {attendanceLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <CalendarDays size={40} className="mb-2 text-slate-300" />
                <p className="text-sm font-medium text-slate-400">Chưa có dữ liệu chấm công</p>
              </div>
            ) : (
              [...attendanceLogs]
                .sort((a, b) => new Date(b.logdate) - new Date(a.logdate))
                .slice(0, 10)
                .map((log, idx) => {
                  const config = STATUS_CONFIG[log.logstatus] || STATUS_CONFIG['Not Specified'];
                  const workHours =
                    log.checkInTime && log.checkOutTime
                      ? ((new Date(log.checkOutTime) - new Date(log.checkInTime)) / 3600000).toFixed(1)
                      : null;

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center w-12">
                          <span className="text-lg font-bold text-slate-700">
                            {new Date(log.logdate).getDate()}
                          </span>
                          <span className="text-[10px] font-semibold uppercase text-slate-400">
                            {new Date(log.logdate).toLocaleDateString('vi-VN', { month: 'short' })}
                          </span>
                        </div>
                        <div>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
                            {config.icon} {config.label}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-right">
                          <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">Vào</p>
                          <p className="font-semibold text-slate-700">
                            {formatTime(log.checkInTime)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">Ra</p>
                          <p className="font-semibold text-slate-700">
                            {formatTime(log.checkOutTime)}
                          </p>
                        </div>
                        {workHours && (
                          <div className="hidden text-right sm:block">
                            <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">Giờ</p>
                            <p className="font-semibold text-blue-600">{workHours}h</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// === SUB COMPONENTS ===
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