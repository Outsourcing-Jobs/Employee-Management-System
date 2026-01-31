import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

const DeleteNoticeModal = ({ isOpen, onClose, onConfirm, employeeName, date, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md p-6 bg-white shadow-2xl rounded-[2rem] animate-in zoom-in duration-200 border border-slate-100">
        {/* Header Modal */}
        <div className="flex items-center justify-between mb-5">
          <div className="p-3 bg-red-50 rounded-2xl">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          <button 
            onClick={onClose}
            className="p-2 transition-colors rounded-full hover:bg-slate-100 text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nội dung thông báo xóa */}
        <div className="mb-8 space-y-3">
          <h4 className="text-2xl font-bold tracking-tight text-slate-800">Xóa thông báo này?</h4>
          <div className="p-4 border bg-slate-50 rounded-2xl border-slate-100">
            <p className="mb-1 text-xs font-black uppercase text-slate-400">Thông báo cần xóa:</p>
            <p className="mb-1 text-sm font-bold text-slate-700 line-clamp-2">{employeeName}</p>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Ngày đăng: {date}</p>
          </div>
          <p className="px-1 text-sm leading-relaxed text-slate-500">
            Lưu ý: Sau khi xóa, nhân viên sẽ không còn nhìn thấy thông báo này trên bảng tin nữa. Hành động này <span className="italic font-bold text-red-600">không thể hoàn tác</span>.
          </p>
        </div>

        {/* Bộ nút điều hướng */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3.5 text-sm font-bold transition-all border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50"
          >
            Quay lại
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold text-white bg-red-600 transition-all rounded-2xl hover:bg-red-700 shadow-lg shadow-red-100 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin"></div>
                Đang xử lý...
              </span>
            ) : (
              <>
                <Trash2 size={16} />
                Xác nhận xóa
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteNoticeModal;