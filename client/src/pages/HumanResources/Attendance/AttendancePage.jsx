import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import dayjs from "dayjs";
import { HandleHRGetAllAttendance } from "../../../redux/Thunks/AttendanceThunk";


const AttendancePage = () => {
  const dispatch = useDispatch();
  const { data: employeesData, isLoading, fetchData } = useSelector((state) => state.AttendanceReducer);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  useEffect(() => {
    if (fetchData) {
      dispatch(HandleHRGetAllAttendance());
    }
  }, [dispatch, fetchData]);

  useEffect(() => {
    const autoReload = setInterval(() => {
      dispatch(HandleHRGetAllAttendance());
    },60000); 

    return () => clearInterval(autoReload);
  }, [dispatch]);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDate]);
  
  const attendanceRows = useMemo(() => {
    if (!Array.isArray(employeesData)) return [];
    const rows = [];
    employeesData.forEach((emp) => {
      const logsByDate = {};
      emp.attendancelog?.forEach((log) => {
        const dateKey = dayjs(log.logdate).format("YYYY-MM-DD");
        if (!logsByDate[dateKey]) logsByDate[dateKey] = [];
        logsByDate[dateKey].push(log);
      });

      Object.keys(logsByDate).forEach((date) => {
        const dayLogs = logsByDate[date].sort((a, b) => dayjs(a.logdate).diff(dayjs(b.logdate)));
        const checkIn = dayLogs[0];
        const checkOut = dayLogs.length > 1 ? dayLogs[dayLogs.length - 1] : null;

        rows.push({
          id: checkIn._id,
          employeeName: `${emp.employee?.firstname} ${emp.employee?.lastname}`,
          date: date,
          checkInTime: checkIn.checkInTime 
            ? dayjs(checkIn.checkInTime).format("HH:mm:ss") 
            : "-",
          checkOutTime: checkIn.checkOutTime 
            ? dayjs(checkIn.checkOutTime).format("HH:mm:ss") 
            : "-",
          status: checkIn.logstatus,
          searchName: `${emp.employee?.firstname} ${emp.employee?.lastname}`.toLowerCase(),
        });
      });
    });
    return rows;
  }, [employeesData])

  const filteredData = useMemo(() => {
    return attendanceRows.filter((row) => {
      const matchesName = row.searchName.includes(searchTerm.toLowerCase());
      const matchesDate = filterDate ? row.date === filterDate : true;
      return matchesName && matchesDate;
    });
  }, [attendanceRows, searchTerm, filterDate]);
  
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * itemsPerPage;
    const lastPageIndex = firstPageIndex + itemsPerPage;
    return filteredData.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, filteredData]);
  
  return (
    <div className="py-6 pr-6 space-y-6">
      <h3 className="text-3xl font-bold text-slate-800">Quản lý chấm công</h3>

      <div className="flex flex-col gap-4 p-4 bg-white border shadow-sm md:flex-row rounded-xl">
        <div className="flex items-center flex-1 gap-2 px-3 transition-all border rounded-lg focus-within:ring-2 ring-blue-100">
          <Search className="text-slate-400" size={18} />
          <input
            className="w-full py-2 text-sm outline-none"
            placeholder="Tìm kiếm nhân viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <input
          type="date"
          className="px-4 py-2 text-sm border rounded-lg outline-none text-slate-600 focus:ring-2 ring-blue-100"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      <div className="overflow-hidden bg-white border shadow-sm rounded-xl">
        <table className="w-full text-left">
          <thead className="text-xs font-bold uppercase border-b bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4 text-center">Ngày</th>
              <th className="px-6 py-4">Nhân viên</th>
              <th className="px-6 py-4 text-center">Giờ vào</th>
              <th className="px-6 py-4 text-center">Giờ ra</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y">
            {isLoading ? (
              <tr><td colSpan="6" className="py-10 text-center text-slate-400">Đang tải dữ liệu...</td></tr>
            ) : currentTableData.length > 0 ? (
              currentTableData.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-center text-slate-600">
                    {dayjs(row.date).format("DD/MM/YYYY")}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700">{row.employeeName}</td>
                  <td className="px-6 py-4 font-bold text-center text-blue-600">{row.checkInTime}</td>
                  <td className="px-6 py-4 font-bold text-center text-amber-600">{row.checkOutTime}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${
                        row.status === "Present" ? "bg-green-100 text-green-700" : 
                        row.status === "Absent" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                      }`}>
                      {row.status === "Present" ? "Có mặt" : row.status === "Absent" ? "Vắng mặt" : "Nghỉ phép"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="py-10 italic text-center text-slate-400">Không tìm thấy dữ liệu.</td></tr>
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t bg-slate-50 border-slate-200">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || totalPages === 0}
            className="p-2 transition-colors bg-white border rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-2 transition-colors bg-white border rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;