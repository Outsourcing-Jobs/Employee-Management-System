import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Megaphone, Plus, Calendar, Edit3, Search, User, Eye, Trash2,  XCircle } from "lucide-react";
import dayjs from "dayjs";
import { HandleGetAllNotices, HandleDeleteNotice } from "../../../redux/Thunks/NoticeThunk";
import NoticeActionModal from "./NoticeActionModal";
import NoticeDetailModal from "./NoticeDetailModal";
import { useToast } from "@/hooks/use-toast";
import DeleteNoticeModal from "./DeleteNoticeModal";
import { HandleGetHRDepartments } from "../../../redux/Thunks/HRDepartmentPageThunk";

const NoticePage = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  const { notices, isLoading, fetchData } = useSelector((state) => state.NoticeReducer);
  const HRDepartmentState = useSelector((state) => state.HRDepartmentPageReducer);
  const departments = HRDepartmentState?.data || [];
  useEffect(() => {
    if (departments.length === 0) {

      dispatch(HandleGetHRDepartments({ apiroute: "GETALL" }));
    }
  }, [dispatch, departments.length]);
  const [filters, setFilters] = useState({
    searchTerm: "", 
    departmentId: "",
    startDate: "",
    sortBy: "createdAt",
    order: "desc"
  });

  const [modalConfig, setModalConfig] = useState({ open: false, mode: "create", data: null });
  const [detailModal, setDetailModal] = useState({ open: false, data: null });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const params = {
      departmentId: filters.departmentId || undefined,
      startDate: filters.startDate || undefined,
      sortBy: filters.sortBy,
      order: filters.order
    };
    dispatch(HandleGetAllNotices(params));
  }, [dispatch, fetchData, filters.departmentId, filters.startDate, filters.sortBy, filters.order]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: "",
      departmentId: "",
      startDate: "",
      sortBy: "createdAt",
      order: "desc"
    });
  };

  const allNotices = useMemo(() => {
    if (!notices) return [];
    const dept = notices.department_notices || [];
    const emp = notices.employee_notices || [];
    return [...dept, ...emp]; 

  }, [notices]);

  const filteredNotices = useMemo(() => {
    return allNotices.filter((notice) => 
      notice.title?.toLowerCase().includes(filters.searchTerm.toLowerCase())
    );
  }, [allNotices, filters.searchTerm]);

  const handleConfirmDelete = async () => {
    if (!selectedNotice) return;
    setIsDeleting(true);
    setIsDeleteModalOpen(false);
    try {
      const result = await dispatch(HandleDeleteNotice(selectedNotice._id)).unwrap();
      toast({ title: "Thành công", description: result?.message || "Đã xóa thông báo!" });
      setSelectedNotice(null);
    } catch (error) {
      toast({ variant: "destructive", title: "Lỗi", description: error?.message || "Lỗi xóa!" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="py-6 pr-6 space-y-6">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 text-blue-600 bg-blue-100 rounded-2xl">
            <Megaphone size={24} />
          </div>
          <h3 className="text-3xl font-bold text-slate-800">Bảng tin nội bộ</h3>
        </div>
        <button onClick={() => setModalConfig({ open: true, mode: "create", data: null })} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
          <Plus size={20} /> Viết thông báo
        </button>
      </div>


      <div className="grid grid-cols-1 gap-4 p-4 bg-white border shadow-sm md:grid-cols-2 lg:grid-cols-5 rounded-2xl">
        <div className="flex items-center gap-2 px-3 border border-transparent lg:col-span-1 bg-slate-50 rounded-xl focus-within:border-blue-200">
          <Search size={18} className="text-slate-400" />
          <input 
            name="searchTerm"
            value={filters.searchTerm}
            onChange={handleFilterChange}
            className="w-full py-2.5 text-sm bg-transparent outline-none" 
            placeholder="Tìm tiêu đề..." 
          />
        </div>

        <select 
          name="departmentId"
          value={filters.departmentId}
          onChange={handleFilterChange}
          className="text-sm bg-slate-50 rounded-xl px-3 py-2.5 border-none outline-none focus:ring-2 ring-blue-100"
        >
          <option value="">Tất cả phòng ban</option>
          {departments?.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
        </select>

        <input 
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="text-sm bg-slate-50 rounded-xl px-3 py-2.5 border-none outline-none focus:ring-2 ring-blue-100 text-slate-600"
        />

        <select 
          name="order"
          value={filters.order}
          onChange={handleFilterChange}
          className="text-sm bg-slate-50 rounded-xl px-3 py-2.5 border-none outline-none"
        >
          <option value="desc">Mới nhất trước</option>
          <option value="asc">Cũ nhất trước</option>
        </select>

        <button 
          onClick={resetFilters}
          className="flex items-center justify-center gap-2 text-sm font-bold transition-colors text-slate-500 hover:text-red-500"
        >
          <XCircle size={18} /> Làm mới bộ lọc
        </button>
      </div>


      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="py-20 font-medium text-center text-slate-400 animate-pulse">Đang tải thông báo...</div>
        ) : filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => (
            <div key={notice._id} className="relative p-6 transition-all bg-white border shadow-sm border-slate-100 rounded-3xl hover:shadow-md group">
              <div className={`absolute top-0 left-0 w-1.5 h-full ${notice.audience === "Department-Specific" ? "bg-amber-400" : "bg-blue-500"}`}></div>
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-tighter">
                    <span className={`px-2 py-0.5 rounded-md ${notice.audience === "Department-Specific" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                      {notice.department?.name || "Toàn công ty"}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400"><Calendar size={12}/> {dayjs(notice.createdAt).format("DD/MM/YYYY")}</span>
                    <span className="flex items-center gap-1 text-slate-400"><User size={12}/> {notice.createdby?.lastname}</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-800">{notice.title}</h4>
                  <p className="text-sm text-slate-500 line-clamp-2">{notice.content}</p>
                </div>
                <div className="flex gap-1 ml-4 transition-opacity opacity-0 group-hover:opacity-100">
                  <button onClick={() => setDetailModal({ open: true, data: notice })} className="p-2 text-blue-600 rounded-lg hover:bg-blue-50"><Eye size={18}/></button>
                  <button onClick={() => setModalConfig({ open: true, mode: "edit", data: notice })} className="p-2 rounded-lg text-amber-600 hover:bg-amber-50"><Edit3 size={18}/></button>
                  <button onClick={() => { setSelectedNotice(notice); setIsDeleteModalOpen(true); }} className="p-2 text-red-600 rounded-lg hover:bg-red-50"><Trash2 size={18}/></button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 italic text-center border-2 border-dashed bg-slate-50 rounded-3xl text-slate-400">Không có thông báo nào.</div>
        )}
      </div>

      <NoticeActionModal isOpen={modalConfig.open} onClose={() => setModalConfig({ ...modalConfig, open: false })} mode={modalConfig.mode} initialData={modalConfig.data} />
      <NoticeDetailModal isOpen={detailModal.open} onClose={() => setDetailModal({ ...detailModal, open: false })} noticeData={detailModal.data} />
      <DeleteNoticeModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleConfirmDelete} isLoading={isDeleting} employeeName={selectedNotice?.title} date={selectedNotice ? dayjs(selectedNotice.createdAt).format("DD/MM/YYYY") : ""} />
    </div>
  );
};

export default NoticePage;