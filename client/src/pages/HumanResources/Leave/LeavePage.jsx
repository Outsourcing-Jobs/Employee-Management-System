import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HandleGetAllLeaves, HandleHRUpdateLeave } from "@/redux/Thunks/LeaveThunk";
import { Search, ChevronLeft, ChevronRight, FileText, Clock, CheckCircle, X, Eye } from "lucide-react";
import dayjs from "dayjs";
import StatCard from "../../../components/common/StatCard";
import LeaveDetailModal from "./LeaveDetailModal";
import { toast } from "../../../hooks/use-toast";
import ConfirmModal from "./ConfirmModal";


const LeavePage = () => {
  const dispatch = useDispatch();
  const { data, isLoading, fetchData } = useSelector((state) => state.HRLeavePageReducer);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [modalType, setModalType] = useState(null); 
  const [confirmStatus, setConfirmStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    if (fetchData) {
      dispatch(HandleGetAllLeaves());
    }
  }, [fetchData, dispatch]);
  useEffect(() => {
    const autoReload = setInterval(() => {
  
      if (!modalType && !isSubmitting) {
        
        dispatch(HandleGetAllLeaves());
      }
    }, 120000);

    return () => clearInterval(autoReload);
  }, [dispatch, modalType, isSubmitting]);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const stats = useMemo(() => {
    const leaves = data || [];
    return {
      total: leaves.length,
      pending: leaves.filter((l) => l.status === "Pending").length,
      approved: leaves.filter((l) => l.status === "Approved").length,
      rejected: leaves.filter((l) => l.status === "Rejected").length,
    };
  }, [data]);


  const filteredData = useMemo(() => {
    return data?.filter((item) => {
      const fullName = `${item.employee?.firstname} ${item.employee?.lastname}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    }) || [];
  }, [data, searchTerm]);


  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * itemsPerPage;
    const lastPageIndex = firstPageIndex + itemsPerPage;
    return filteredData.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, filteredData]);
  const handleConfirmAction = async () => {
    if (!selectedLeave?._id || !confirmStatus) return;
  
    setIsSubmitting(true);
    setModalType(null);   
    
    try {
      const result = await dispatch(
        HandleHRUpdateLeave({
          leaveID: selectedLeave._id,
          status: confirmStatus,
        })
      ).unwrap();
    
      toast({
        title: "Thành công",
        description: result?.message || "Cập nhật trạng thái thành công!",
      });
    
      dispatch(HandleGetAllLeaves());
      setModalType(null);
      setSelectedLeave(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error?.message || "Có lỗi xảy ra, vui lòng thử lại!",
      });
    }
  };
  
  return (
    <div className="min-h-screen py-6 pr-6 space-y-6">
      <h3 className="min-[250px]:text-xl md:text-3xl font-bold">Nghỉ phép</h3>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatCard icon={<FileText className="text-blue-600" />} label="Tổng đơn" value={stats.total} color="bg-blue-50" />
        <StatCard icon={<Clock className="text-amber-600" />} label="Chờ duyệt" value={stats.pending} color="bg-amber-50" />
        <StatCard icon={<CheckCircle className="text-green-600" />} label="Đã duyệt" value={stats.approved} color="bg-green-50" />
        <StatCard icon={<X className="text-red-600" />} label="Từ chối" value={stats.rejected} color="bg-red-50" />
      </div>

      <div className="flex items-center gap-3 p-4 bg-white border shadow-sm rounded-xl border-slate-200">
        <Search className="text-slate-400" size={20} />
        <input
          placeholder="Tìm kiếm theo tên nhân viên..."
          className="w-full text-sm outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>


      <div className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200">
        <table className="w-full text-left">
          <thead className="text-xs font-bold uppercase border-b bg-slate-50 border-slate-200 text-slate-500">
            <tr>
              <th className="px-6 py-4">Nhân viên</th>
              <th className="px-6 py-4 text-center">Thời gian</th>
              <th className="px-6 py-4">Lý do</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {currentTableData.map((item) => (
              <tr key={item._id} className="transition-colors hover:bg-slate-50">
                <td className="px-6 py-4 font-semibold text-slate-900">
                  {item.employee?.firstname} {item.employee?.lastname}
                </td>
                <td className="px-6 py-4 text-center text-slate-600">
                  {dayjs(item.startdate).format("DD/MM/YYYY")} - {dayjs(item.enddate).format("DD/MM/YYYY")}
                </td>
                <td className="px-6 py-4 text-slate-600 truncate max-w-[200px]">{item.reason}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${
                    item.status === "Pending" ? "bg-amber-100 text-amber-700" : 
                    item.status === "Approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="flex items-center justify-center px-6 py-4 text-center">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => { setSelectedLeave(item); setModalType('detail'); }}
                      className="p-2 text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                    >
                      <Eye size={16} />
                    </button>
                    {item.status === "Pending" && (
                      <>
                        <button 
                          onClick={() => { setSelectedLeave(item); setConfirmStatus("Approved"); setModalType('confirm'); }}
                          className="px-3 py-1 text-xs font-bold text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700"
                        > Duyệt </button>
                        <button 
                          onClick={() => { setSelectedLeave(item); setConfirmStatus("Rejected"); setModalType('confirm'); }}
                          className="px-3 py-1 text-xs font-bold text-white transition-all bg-red-600 rounded-lg hover:bg-red-700"
                        > Từ chối </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t bg-slate-50 border-slate-200 ">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
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

        {filteredData.length === 0 && !isLoading && (
          <div className="p-8 italic text-center text-slate-400">Không tìm thấy đơn nào.</div>
        )}
        <ConfirmModal 
        isOpen={modalType === 'confirm'}
        onClose={() => setModalType(null)}
        onConfirm={handleConfirmAction}
        status={confirmStatus}
        employeeName={`${selectedLeave?.employee?.firstname} ${selectedLeave?.employee?.lastname}`}
        isLoading={isSubmitting}
      />

      <LeaveDetailModal 
        isOpen={modalType === 'detail'}
        onClose={() => setModalType(null)}
        leaveData={selectedLeave}
      />
      </div>
  );
};



export default LeavePage;