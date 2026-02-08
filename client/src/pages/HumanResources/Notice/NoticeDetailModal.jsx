import React from 'react';
import { X, Calendar, User, Building, Info } from 'lucide-react';
import dayjs from 'dayjs';

const NoticeDetailModal = ({ isOpen, onClose, noticeData }) => {
  if (!isOpen || !noticeData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden duration-300 bg-white shadow-2xl rounded-3xl animate-in slide-in-from-bottom-4">
        <div className="relative flex items-end h-32 p-6 bg-gradient-to-r from-blue-600 to-indigo-700">
          <button 
            onClick={onClose} 
            className="absolute p-2 text-white rounded-full top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 text-white">
            <div className="p-3 border bg-white/20 rounded-2xl backdrop-blur-md border-white/30">
               <Info size={24} />
            </div>
            <div>
                <p className="text-xs font-bold uppercase opacity-80">Chi tiết thông báo</p>
                <h3 className="max-w-sm text-xl font-bold truncate">{noticeData.title}</h3>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-6 pb-8 border-b">
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-500"><Calendar size={18}/></div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Ngày tạo</p>
                        <p className="text-sm font-bold text-slate-700">{dayjs(noticeData.createdAt).format("DD/MM/YYYY HH:mm")}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-500"><User size={18}/></div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Người đăng</p>
                        <p className="text-sm font-bold text-slate-700">{noticeData.createdby?.lastname}</p>
                    </div>
                </div>
                <div className="flex items-start col-span-2 gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-500"><Building size={18}/></div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Đối tượng nhận</p>
                        <p className="text-sm font-bold text-blue-600">
                            {noticeData.audience === "Department-Specific" 
                                ? `Phòng ban: ${noticeData.department?.name || "Chưa xác định"}` 
                                : `Nhân viên: ${
                                    noticeData.employee?.firstname 
                                    ? `${noticeData.employee.firstname} ${noticeData.employee.lastname}` 
                                    : (noticeData.employee || "Chưa xác định")
                                }`
                            }
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase ml-1">Nội dung thông báo</p>
                <div className="p-6 text-sm italic leading-relaxed whitespace-pre-wrap border bg-slate-50 rounded-2xl text-slate-600 border-slate-100">
                    "{noticeData.content}"
                </div>
            </div>

            <button 
                onClick={onClose}
                className="w-full py-4 text-xs font-black tracking-widest text-white uppercase transition-all shadow-lg bg-slate-800 rounded-2xl hover:bg-black"
            >
                Đã đọc và đóng
            </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetailModal;