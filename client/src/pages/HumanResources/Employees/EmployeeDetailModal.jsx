import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  ShieldCheck,
  ClipboardList,
  Banknote,
} from "lucide-react";

const EmployeeDetailModal = ({ isOpen, onClose, employeeData }) => {
  if (!employeeData) return null;

  const InfoRow = ({ icon: Icon, label, value, color = "text-slate-600" }) => (
    <div className="flex items-center gap-4 p-4 transition-all border border-slate-50 rounded-2xl hover:bg-slate-50">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
          {label}
        </p>
        <p className={`text-sm font-bold ${color}`}>{value || "---"}</p>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white border-none shadow-2xl rounded-[32px] p-0 overflow-hidden">
        {/* Header Section */}
        <div className="relative p-8 text-white bg-blue-600">
          <div className="flex items-center gap-6">
            <div className="flex items-center justify-center text-3xl bg-white border-4 border-white shadow-xl w-24 h-24 font-black text-blue-600 rounded-[28px]">
              {employeeData.lastname ? employeeData.lastname[0] : "U"}
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight">
                {employeeData.firstname} {employeeData.lastname}
              </h2>
              <div className="flex items-center gap-2 mt-2 opacity-80">
                <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                  ID: {employeeData._id?.slice(-8)}
                </span>
                {employeeData.isverified && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-blue-100 italic">
                    <ShieldCheck size={12} /> Đã xác thực tài khoản
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
   
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 mb-2 text-xs font-black uppercase text-slate-400">
              <User size={14} /> Thông tin liên hệ
            </h4>
            <InfoRow
              icon={Mail}
              label="Địa chỉ Email"
              value={employeeData.email}
              color="text-blue-600"
            />
            <InfoRow
              icon={Phone}
              label="Số điện thoại"
              value={employeeData.contactnumber}
            />
          </div>

          <div className="space-y-4">
            <h4 className="flex items-center gap-2 mb-2 text-xs font-black uppercase text-slate-400">
              <Briefcase size={14} /> Vị trí công tác
            </h4>
            <InfoRow
              icon={Briefcase}
              label="Phòng ban"
              value={employeeData.department?.name || "Chưa xếp phòng"}
              color="text-slate-800"
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 text-center border bg-slate-50 rounded-2xl border-slate-100">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">
                  Phiếu lương
                </p>
                <p className="text-lg font-black text-slate-800">
                  {employeeData.salary?.length || 0}
                </p>
              </div>
              <div className="p-4 text-center border bg-slate-50 rounded-2xl border-slate-100">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">
                  Đơn nghỉ
                </p>
                <p className="text-lg font-black text-slate-800">
                  {employeeData.leaverequest?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-8 pt-0">
          <button
            onClick={onClose}
            className="px-6 py-2 font-black text-white transition-all bg-blue-800 rounded-xl hover:bg-blue-900 active:scale-95"
          >
            Đóng hồ sơ
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetailModal;
