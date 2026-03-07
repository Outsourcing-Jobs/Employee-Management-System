import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FileText, Plus, Clock, CheckCircle2, XCircle,
  Send, Edit3, Trash2, Eye, X,
  ChevronDown, Filter, Search, CalendarDays,
  MessageSquare, RefreshCcw
} from 'lucide-react';
import { 
  HandleGetRequests,
  HandleGetRequestByID, 
  HandleUpdateRequestContent,
  HandleCreateRequest,
  HandleDeleteRequest,
} from '../../../redux/Thunks/GenerateRequestThunk';
import { toast } from '../../../hooks/use-toast';

const STATUS_CONFIG = {
  pending: { label: 'Đang chờ', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: <Clock size={14} /> },
  approved: { label: 'Đã duyệt', color: 'bg-green-50 text-green-700 border-green-200', icon: <CheckCircle2 size={14} /> },
  rejected: { label: 'Từ chối', color: 'bg-red-50 text-red-700 border-red-200', icon: <XCircle size={14} /> },
};

const RequestPage = () => {
  const dispatch = useDispatch();

  const { data: requests, isLoading, fetchData } = useSelector(
    (state) => state.GenerateRequestReducer || {}
  );

  const employeeId = useSelector(
    (state) => state.HREmployeesPageReducer?.employeeData?.data?._id
  );

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [createForm, setCreateForm] = useState({
    title: '',
    content: '',
  });

  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
  });

  // Fetch requests
  useEffect(() => {
    dispatch(HandleGetRequests());
  }, [dispatch]);

  // Refetch khi có thay đổi
  useEffect(() => {
    if (fetchData) {
      dispatch(HandleGetRequests());
    }
  }, [fetchData, dispatch]);

  // === HANDLERS ===
  const handleCreate = async () => {
    if (!createForm.title.trim() || !createForm.content.trim()) {
      toast({ variant: 'destructive', title: 'Lỗi', description: 'Vui lòng điền đầy đủ thông tin' });
      return;
    }
    if (!employeeId) {
      toast({ variant: 'destructive', title: 'Lỗi', description: 'Không tìm thấy thông tin nhân viên. Vui lòng tải lại trang.' });
      return;
    }
    try {
      await dispatch(HandleCreateRequest({
        requesttitle: createForm.title,
        requestconent: createForm.content,
        employeeID: employeeId,
      })).unwrap();
      toast({ title: 'Thành công', description: 'Tạo yêu cầu thành công' });
      setShowCreateModal(false);
      setCreateForm({ title: '', content: '' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Lỗi', description: err?.message || 'Tạo yêu cầu thất bại' });
    }
  };

  const handleViewDetail = async (request) => {
    try {
      const result = await dispatch(HandleGetRequestByID(request._id)).unwrap();
      setSelectedRequest(result.data?.data || result.data);
      setShowDetailModal(true);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Lỗi', description: 'Không thể tải chi tiết yêu cầu' });
    }
  };

  const handleOpenEdit = (request) => {
    setSelectedRequest(request);
    setEditForm({
      title: request.requesttitle || request.title || '',
      content: request.requestconent || request.content || '',
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editForm.content.trim()) {
      toast({ variant: 'destructive', title: 'Lỗi', description: 'Nội dung không được để trống' });
      return;
    }
    try {
      await dispatch(HandleUpdateRequestContent({
        requestId: selectedRequest._id,
        requesttitle: editForm.title,
        requestconent: editForm.content,
      })).unwrap();
      toast({ title: 'Thành công', description: 'Cập nhật yêu cầu thành công' });
      setShowEditModal(false);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Lỗi', description: err?.message || 'Cập nhật thất bại' });
    }
  };

  const handleDelete = async (requestId) => {
    if (!window.confirm('Bạn có chắc muốn xóa yêu cầu này?')) return;
    try {
      await dispatch(HandleDeleteRequest(requestId)).unwrap();
      toast({ title: 'Thành công', description: 'Xóa yêu cầu thành công' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Lỗi', description: err?.message || 'Xóa thất bại' });
    }
  };

  // === FILTER ===
  const filteredRequests = (requests || []).filter((req) => {
    const title = req.requesttitle || req.title || '';
    const content = req.requestconent || req.content || '';
    const matchSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || req.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
        {config.icon} {config.label}
      </span>
    );
  };

  // === STATS ===
  const stats = {
    total: (requests || []).length,
    pending: (requests || []).filter(r => r.status === 'pending' || !r.status).length,
    approved: (requests || []).filter(r => r.status === 'approved').length,
    rejected: (requests || []).filter(r => r.status === 'rejected').length,
  };

  if (isLoading && !requests) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3">
        <div className="w-10 h-10 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        <p className="font-semibold text-blue-600">Đang tải yêu cầu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-8xl">

        {/* HEADER */}
        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Yêu cầu nội bộ</h1>
            <p className="mt-1 text-sm text-slate-500">Quản lý các yêu cầu của bạn</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-200"
          >
            <Plus size={18} /> Tạo yêu cầu mới
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
          <StatCard label="Tổng" value={stats.total} icon={<FileText size={20} />} color="blue" />
          <StatCard label="Đang chờ" value={stats.pending} icon={<Clock size={20} />} color="yellow" />
          <StatCard label="Đã duyệt" value={stats.approved} icon={<CheckCircle2 size={20} />} color="green" />
          <StatCard label="Từ chối" value={stats.rejected} icon={<XCircle size={20} />} color="red" />
        </div>

        {/* SEARCH & FILTER */}
        <div className="flex flex-col gap-3 mb-6 sm:flex-row">
          <div className="relative flex-1">
            <Search size={18} className="absolute text-slate-400 left-3 top-3" />
            <input
              type="text"
              placeholder="Tìm kiếm yêu cầu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2.5 pl-10 pr-4 border border-slate-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            />
          </div>
          <div className="relative">
            <Filter size={16} className="absolute text-slate-400 left-3 top-3.5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="py-2.5 pl-9 pr-8 border border-slate-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 appearance-none cursor-pointer"
            >
              <option value="all">Tất cả</option>
              <option value="pending">Đang chờ</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>
            <ChevronDown size={16} className="absolute pointer-events-none text-slate-400 right-3 top-3.5" />
          </div>
          <button
            onClick={() => dispatch(HandleGetRequests())}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 text-sm font-medium"
          >
            <RefreshCcw size={16} /> Tải lại
          </button>
        </div>

        {/* TABLE */}
        {filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white border shadow-sm rounded-2xl border-slate-200">
            <FileText size={48} className="mb-3 text-slate-300" />
            <p className="font-semibold text-slate-500">Chưa có yêu cầu nào</p>
            <p className="mt-1 text-sm text-slate-400">Nhấn "Tạo yêu cầu mới" để bắt đầu</p>
          </div>
        ) : (
          <div className="overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-slate-50 border-slate-100">
                    <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Tiêu đề</th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Trạng thái</th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 hidden md:table-cell">Ngày tạo</th>
                    <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRequests.map((req) => (
                    <tr key={req._id} className="transition-colors hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800 line-clamp-1">
                          {req.requesttitle || req.title || 'Không có tiêu đề'}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400 line-clamp-1">
                          {req.requestconent || req.content}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        {getStatusBadge(req.status || 'pending')}
                      </td>
                      <td className="hidden px-5 py-4 md:table-cell">
                        <span className="flex items-center gap-1.5 text-sm text-slate-500">
                          <CalendarDays size={14} /> {formatDate(req.createdAt)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleViewDetail(req)}
                            className="p-2 transition-colors rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600"
                            title="Xem chi tiết"
                          >
                            <Eye size={16} />
                          </button>
                          {(req.status === 'pending' || !req.status) && (
                            <>
                              <button
                                onClick={() => handleOpenEdit(req)}
                                className="p-2 transition-colors rounded-lg hover:bg-yellow-50 text-slate-400 hover:text-yellow-600"
                                title="Chỉnh sửa"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(req._id)}
                                className="p-2 transition-colors rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"
                                title="Xóa"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL TẠO MỚI */}
      {showCreateModal && (
        <Modal onClose={() => setShowCreateModal(false)} title="Tạo yêu cầu mới">
          <div className="space-y-4">
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-slate-600">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={createForm.title}
                onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Nhập tiêu đề yêu cầu..."
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-sm"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-slate-600">
                Nội dung <span className="text-red-500">*</span>
              </label>
              <textarea
                value={createForm.content}
                onChange={(e) => setCreateForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Mô tả chi tiết yêu cầu của bạn..."
                rows={5}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-sm resize-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-5 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 font-semibold text-sm"
              >
                Hủy
              </button>
              <button
                onClick={handleCreate}
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                ) : (
                  <Send size={16} />
                )}
                {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL CHI TIẾT */}
      {showDetailModal && selectedRequest && (
        <Modal onClose={() => setShowDetailModal(false)} title="Chi tiết yêu cầu">
          <div className="space-y-4">
            <DetailRow 
              label="Tiêu đề" 
              value={selectedRequest.requesttitle || selectedRequest.title || 'N/A'} 
            />
            <DetailRow 
              label="Trạng thái" 
              value={getStatusBadge(selectedRequest.status || 'pending')} 
            />
            <DetailRow 
              label="Ngày tạo" 
              value={formatDate(selectedRequest.createdAt)} 
            />
            {selectedRequest.department && (
              <DetailRow 
                label="Phòng ban" 
                value={typeof selectedRequest.department === 'object' 
                  ? selectedRequest.department.name 
                  : selectedRequest.department
                } 
              />
            )}
            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                Nội dung
              </label>
              <div className="p-4 text-sm leading-relaxed whitespace-pre-wrap border bg-slate-50 rounded-xl border-slate-100 text-slate-700">
                {selectedRequest.requestconent || selectedRequest.content || 'Không có nội dung'}
              </div>
            </div>
            {selectedRequest.response && (
              <div>
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Phản hồi từ HR
                </label>
                <div className="p-4 text-sm leading-relaxed border border-blue-100 bg-blue-50 rounded-xl text-slate-700">
                  <MessageSquare size={14} className="inline mr-1.5 text-blue-500" />
                  {selectedRequest.response}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* MODAL CHỈNH SỬA */}
      {showEditModal && selectedRequest && (
        <Modal onClose={() => setShowEditModal(false)} title="Chỉnh sửa yêu cầu">
          <div className="space-y-4">
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-slate-600">Tiêu đề</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-sm"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-slate-600">Nội dung</label>
              <textarea
                value={editForm.content}
                onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                rows={5}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-sm resize-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-5 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 font-semibold text-sm"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdate}
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                ) : (
                  <Edit3 size={16} />
                )}
                {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// === SUB COMPONENTS ===
const StatCard = ({ label, value, icon, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    red: 'bg-red-50 text-red-600 border-red-100',
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

const Modal = ({ children, onClose, title }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
    <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white shadow-2xl rounded-2xl">
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div>
    <label className="block mb-1 text-xs font-bold tracking-wider uppercase text-slate-400">{label}</label>
    <div className="text-sm font-medium text-slate-700">{value}</div>
  </div>
);

export default RequestPage;