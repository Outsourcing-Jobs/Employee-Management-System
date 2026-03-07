import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CalendarDays, Plus, Clock, CheckCircle2, XCircle,
  Send, Eye, Trash2, X, ChevronDown, Filter, Search,
  RefreshCcw, Calendar, AlertCircle, FileText
} from 'lucide-react';
import {
  HandleGetAllLeaves,
  HandleCreateLeave,
  HandleDeleteLeave,
  HandleGetLeaveByID,
} from '../../../redux/Thunks/LeaveThunk';
import { toast } from '../../../hooks/use-toast';

const STATUS_CONFIG = {
  pending: {
    label: 'Đang chờ',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    icon: <Clock size={14} />,
  },
  approved: {
    label: 'Đã duyệt',
    color: 'bg-green-50 text-green-700 border-green-200',
    icon: <CheckCircle2 size={14} />,
  },
  rejected: {
    label: 'Từ chối',
    color: 'bg-red-50 text-red-700 border-red-200',
    icon: <XCircle size={14} />,
  },
};

const LeavePage = () => {
  const dispatch = useDispatch();

  const { data: leaves, isLoading, fetchData } = useSelector(
    (state) => state.HRLeavePageReducer || {}
  );

  const employeeId = useSelector(
    (state) => state.HREmployeesPageReducer?.employeeData?.data?._id
  );

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [createForm, setCreateForm] = useState({
    title: '',
    reason: '',
    startdate: '',
    enddate: '',
  });

  // Fetch leaves
  useEffect(() => {
    dispatch(HandleGetAllLeaves());
  }, [dispatch]);

  useEffect(() => {
    if (fetchData) {
      dispatch(HandleGetAllLeaves());
    }
  }, [fetchData, dispatch]);

  // === HANDLERS ===
  const handleCreate = async () => {
    if (!createForm.title.trim() || !createForm.reason.trim() || !createForm.startdate || !createForm.enddate) {
      toast({ variant: 'destructive', title: 'Lỗi', description: 'Vui lòng điền đầy đủ thông tin' });
      return;
    }

    if (new Date(createForm.startdate) > new Date(createForm.enddate)) {
      toast({ variant: 'destructive', title: 'Lỗi', description: 'Ngày bắt đầu không được lớn hơn ngày kết thúc' });
      return;
    }

    if (!employeeId) {
      toast({ variant: 'destructive', title: 'Lỗi', description: 'Không tìm thấy thông tin nhân viên' });
      return;
    }

    try {
      await dispatch(HandleCreateLeave({
        employeeID: employeeId,
        title: createForm.title,
        reason: createForm.reason,
        startdate: createForm.startdate,
        enddate: createForm.enddate,
      })).unwrap();
      toast({ title: 'Thành công', description: 'Gửi đơn nghỉ phép thành công' });
      setShowCreateModal(false);
      setCreateForm({ title: '', reason: '', startdate: '', enddate: '' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Lỗi', description: err?.message || 'Gửi đơn nghỉ phép thất bại' });
    }
  };

  const handleViewDetail = async (leave) => {
    try {
      const result = await dispatch(HandleGetLeaveByID(leave._id)).unwrap();
      setSelectedLeave(result.data || result);
      setShowDetailModal(true);
    } catch (err) {
      // Fallback dùng data hiện có
      setSelectedLeave(leave);
      setShowDetailModal(true);
    }
  };

  const handleDelete = async (leaveId) => {
    if (!window.confirm('Bạn có chắc muốn xóa đơn nghỉ phép này?')) return;
    try {
      await dispatch(HandleDeleteLeave(leaveId)).unwrap();
      toast({ title: 'Thành công', description: 'Xóa đơn nghỉ phép thành công' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Lỗi', description: err?.message || 'Xóa thất bại' });
    }
  };

  // === HELPERS ===
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const calcDays = (start, end) => {
    if (!start || !end) return 0;
    const diff = new Date(end) - new Date(start);
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const getStatusBadge = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
        {config.icon} {config.label}
      </span>
    );
  };

  // === FILTER ===
  const filteredLeaves = useMemo(() => {
    return (leaves || []).filter((leave) => {
      const matchSearch =
        (leave.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (leave.reason || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterStatus === 'all' || leave.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [leaves, searchTerm, filterStatus]);

  // === STATS ===
  const stats = useMemo(() => ({
    total: (leaves || []).length,
    pending: (leaves || []).filter(l => l.status === 'pending' || !l.status).length,
    approved: (leaves || []).filter(l => l.status === 'approved').length,
    rejected: (leaves || []).filter(l => l.status === 'rejected').length,
  }), [leaves]);

  // Tính tổng ngày nghỉ đã duyệt
  const totalApprovedDays = useMemo(() => {
    return (leaves || [])
      .filter(l => l.status === 'approved')
      .reduce((sum, l) => sum + calcDays(l.startdate, l.enddate), 0);
  }, [leaves]);

  // === LOADING ===
  if (isLoading && !leaves?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3">
        <div className="w-10 h-10 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        <p className="font-semibold text-blue-600">Đang tải dữ liệu nghỉ phép...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto space-y-6 max-w-8xl">

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Nghỉ phép</h1>
            <p className="mt-1 text-sm text-slate-500">Quản lý đơn xin nghỉ phép của bạn</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-200"
          >
            <Plus size={18} /> Tạo đơn nghỉ phép
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <StatCard label="Tổng đơn" value={stats.total} icon={<FileText size={20} />} color="blue" />
          <StatCard label="Đang chờ" value={stats.pending} icon={<Clock size={20} />} color="yellow" />
          <StatCard label="Đã duyệt" value={stats.approved} icon={<CheckCircle2 size={20} />} color="green" />
          <StatCard label="Từ chối" value={stats.rejected} icon={<XCircle size={20} />} color="red" />
          <StatCard label="Ngày đã nghỉ" value={totalApprovedDays} icon={<Calendar size={20} />} color="indigo" />
        </div>

        {/* SEARCH & FILTER */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={18} className="absolute text-slate-400 left-3 top-3" />
            <input
              type="text"
              placeholder="Tìm kiếm đơn nghỉ phép..."
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
            onClick={() => dispatch(HandleGetAllLeaves())}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 text-sm font-medium"
          >
            <RefreshCcw size={16} /> Tải lại
          </button>
        </div>

        {/* TABLE */}
        {filteredLeaves.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white border shadow-sm rounded-2xl border-slate-200">
            <CalendarDays size={48} className="mb-3 text-slate-300" />
            <p className="font-semibold text-slate-500">Chưa có đơn nghỉ phép nào</p>
            <p className="mt-1 text-sm text-slate-400">Nhấn "Tạo đơn nghỉ phép" để bắt đầu</p>
          </div>
        ) : (
          <div className="overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-slate-50 border-slate-100">
                    <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Tiêu đề</th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 hidden sm:table-cell">Thời gian</th>
                    <th className="px-5 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-slate-500 hidden md:table-cell">Số ngày</th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Trạng thái</th>
                    <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeaves.map((leave) => (
                    <tr key={leave._id} className="transition-colors hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800 line-clamp-1">
                          {leave.title || 'Không có tiêu đề'}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400 line-clamp-1">
                          {leave.reason}
                        </p>
                      </td>
                      <td className="hidden px-5 py-4 sm:table-cell">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <CalendarDays size={14} className="text-slate-400" />
                          <span>{formatDate(leave.startdate)}</span>
                          <span className="text-slate-300">→</span>
                          <span>{formatDate(leave.enddate)}</span>
                        </div>
                      </td>
                      <td className="hidden px-5 py-4 text-center md:table-cell">
                        <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 text-blue-600">
                          {calcDays(leave.startdate, leave.enddate)} ngày
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {getStatusBadge(leave.status || 'pending')}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleViewDetail(leave)}
                            className="p-2 transition-colors rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600"
                            title="Xem chi tiết"
                          >
                            <Eye size={16} />
                          </button>
                          {(leave.status === 'pending' || !leave.status) && (
                            <button
                              onClick={() => handleDelete(leave._id)}
                              className="p-2 transition-colors rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"
                              title="Xóa"
                            >
                              <Trash2 size={16} />
                            </button>
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

      {/* MODAL TẠO ĐƠN */}
      {showCreateModal && (
        <Modal onClose={() => setShowCreateModal(false)} title="Tạo đơn nghỉ phép">
          <div className="space-y-4">
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-slate-600">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={createForm.title}
                onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="VD: Nghỉ phép cá nhân..."
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1.5 text-sm font-semibold text-slate-600">
                  Ngày bắt đầu <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={createForm.startdate}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, startdate: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-sm"
                />
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-semibold text-slate-600">
                  Ngày kết thúc <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={createForm.enddate}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, enddate: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-sm"
                />
              </div>
            </div>
            {createForm.startdate && createForm.enddate && new Date(createForm.startdate) <= new Date(createForm.enddate) && (
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-blue-600 rounded-lg bg-blue-50">
                <Calendar size={14} />
                Tổng: {calcDays(createForm.startdate, createForm.enddate)} ngày nghỉ
              </div>
            )}
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-slate-600">
                Lý do <span className="text-red-500">*</span>
              </label>
              <textarea
                value={createForm.reason}
                onChange={(e) => setCreateForm(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Nhập lý do xin nghỉ phép..."
                rows={4}
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
                {isLoading ? 'Đang gửi...' : 'Gửi đơn'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL CHI TIẾT */}
      {showDetailModal && selectedLeave && (
        <Modal onClose={() => setShowDetailModal(false)} title="Chi tiết đơn nghỉ phép">
          <div className="space-y-4">
            <DetailRow label="Tiêu đề" value={selectedLeave.title || 'N/A'} />
            <DetailRow label="Trạng thái" value={getStatusBadge(selectedLeave.status || 'pending')} />
            <div className="grid grid-cols-2 gap-4">
              <DetailRow label="Ngày bắt đầu" value={formatDate(selectedLeave.startdate)} />
              <DetailRow label="Ngày kết thúc" value={formatDate(selectedLeave.enddate)} />
            </div>
            <DetailRow
              label="Số ngày nghỉ"
              value={
                <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 text-blue-600">
                  {calcDays(selectedLeave.startdate, selectedLeave.enddate)} ngày
                </span>
              }
            />
            {selectedLeave.employee && typeof selectedLeave.employee === 'object' && (
              <DetailRow
                label="Nhân viên"
                value={`${selectedLeave.employee.firstname || ''} ${selectedLeave.employee.lastname || ''}`}
              />
            )}
            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                Lý do
              </label>
              <div className="p-4 text-sm leading-relaxed whitespace-pre-wrap border bg-slate-50 rounded-xl border-slate-100 text-slate-700">
                {selectedLeave.reason || 'Không có lý do'}
              </div>
            </div>
            <DetailRow label="Ngày tạo đơn" value={formatDate(selectedLeave.createdAt)} />
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
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
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

export default LeavePage;