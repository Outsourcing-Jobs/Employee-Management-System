import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileText, Download, ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";
import { HandleGetAllSalaries } from "@/redux/Thunks/SalaryThunk";
import { HandleGetReport } from "../../../redux/Thunks/ReportThunk";

const SalaryPage = () => {
  const dispatch = useDispatch();
  const { salaries, isLoading } = useSelector((state) => state.SalaryReducer);

  const [filters, setFilters] = useState({
    status: "Paid",
    startDate: "2026-01-01",
    endDate: "2026-01-31",
    minNet: 20000000,
    sortBy: "netpay",
    order: "desc",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(HandleGetAllSalaries(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };


  const totalPages = Math.ceil((salaries?.length || 0) / itemsPerPage);
  
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * itemsPerPage;
    const lastPageIndex = firstPageIndex + itemsPerPage;
    return salaries?.slice(firstPageIndex, lastPageIndex) || [];
  }, [currentPage, salaries]);

  const handleExportCurrentMonth = () => {
    const now = new Date();
    const month = now.getMonth() + 1; // getMonth() trả 0-11
    const year = now.getFullYear();

    dispatch(
      HandleGetReport({
        apiroute: "EXPORT_SALARY_BY_MONTH",
        params: { month, year },
        responseType: "blob", // vì thường export là file
      })
    );
  };

  return (
    <div className="py-6 pr-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl font-bold text-slate-800">
          Bảng lương hệ thống
        </h3>
        <button 
          onClick={handleExportCurrentMonth}
          className="flex items-center gap-2 px-4 py-2 font-bold text-white transition-all bg-green-600 rounded-xl hover:bg-green-700">
          <Download size={18} /> Xuất báo cáo
        </button>
      </div>


      <div className="grid grid-cols-1 gap-4 p-4 bg-white border shadow-sm md:grid-cols-3 lg:grid-cols-5 rounded-2xl">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-400">Trạng thái</label>
          <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full p-2 text-sm border-none rounded-lg outline-none bg-slate-50">
            <option value="Paid">Đã trả</option>
            <option value="Pending">Chờ trả</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-400">Từ ngày</label>
          <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="w-full p-2 text-sm border-none rounded-lg outline-none bg-slate-50" />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-400">Đến ngày</label>
          <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="w-full p-2 text-sm border-none rounded-lg outline-none bg-slate-50" />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-400">Thực nhận tối thiểu</label>
          <input type="number" name="minNet" value={filters.minNet} onChange={handleFilterChange} className="w-full p-2 text-sm border-none rounded-lg outline-none bg-slate-50" placeholder="20.000.000" />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-400">Thứ tự</label>
          <select name="order" value={filters.order} onChange={handleFilterChange} className="w-full p-2 text-sm border-none rounded-lg outline-none bg-slate-50">
            <option value="desc">Giảm dần</option>
            <option value="asc">Tăng dần</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden bg-white border shadow-sm rounded-2xl">
        <table className="w-full text-left">
          <thead className="text-xs font-bold uppercase border-b bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4">Nhân viên</th>
              <th className="px-6 py-4 text-center">Ngày tạo</th>
              <th className="px-6 py-4 text-center">Ngày trả</th>
              <th className="px-6 py-4 text-center">Lương cơ bản</th>
              <th className="px-6 py-4 text-center">Thực nhận (Net)</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y">
            {isLoading ? (
              <tr><td colSpan="6" className="py-10 font-medium text-center text-slate-400 animate-pulse">Đang tải dữ liệu...</td></tr>
            ) : currentTableData.length > 0 ? (
              currentTableData.map((s) => (
                <tr key={s._id} className="transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-700">{s.employee?.firstname} {s.employee?.lastname}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-center text-slate-600">{dayjs(s.createdAt).format("DD/MM/YYYY")}</td>
                  <td className="px-6 py-4 font-medium text-center text-slate-600">{dayjs(s.updateAt).format("DD/MM/YYYY")}</td>
                  <td className="px-6 py-4 font-medium text-center">{s.basicpay?.toLocaleString()} {s.currency}</td>
                  <td className="px-6 py-4 font-black text-center text-blue-600">{s.netpay?.toLocaleString()} {s.currency}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${s.status === "Paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {s.status === "Paid" ? "Đã trả" : "Chờ trả"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 text-blue-600 transition-all rounded-lg hover:bg-blue-50">
                      <FileText size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="py-20 italic text-center text-slate-400">Không tìm thấy bản ghi lương nào khớp với bộ lọc.</td></tr>
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
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
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

export default SalaryPage;