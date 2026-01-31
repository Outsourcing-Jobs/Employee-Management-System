import { X } from "lucide-react";
import dayjs from "dayjs";

const LeaveDetailModal = ({ isOpen, onClose, leaveData }) => {
  if (!isOpen || !leaveData) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center mt-[-10px]!important bg-black/40 backdrop-blur-sm"
      style={{ marginTop: "-10px" }}
    >
      <div className="w-full max-w-lg overflow-hidden duration-300 bg-white shadow-2xl rounded-2xl animate-in slide-in-from-bottom-4">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h4 className="text-xl font-bold text-slate-800">
            Chi tiết đơn nghỉ phép
          </h4>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-full hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4 text-left">
          <DetailItem
            label="Nhân viên"
            value={`${leaveData.employee?.firstname} ${leaveData.employee?.lastname}`}
          />
          <DetailItem label="Loại đơn" value={leaveData.title} />
          <DetailItem label="Lý do" value={leaveData.reason} />
          <DetailItem
            label="Thời gian nghỉ"
            value={`${dayjs(leaveData.startdate).format(
              "DD/MM/YYYY"
            )} - ${dayjs(leaveData.enddate).format("DD/MM/YYYY")}`}
          />
          <div className="pt-2">
            <p className="mb-1 text-xs font-bold tracking-wider uppercase text-slate-400">
              Trạng thái hiện tại
            </p>
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                leaveData.status === "Pending"
                  ? "bg-amber-100 text-amber-700"
                  : leaveData.status === "Approved"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {leaveData.status}
            </span>
          </div>
        </div>

        <div className="flex justify-end p-4 px-6 border-t bg-slate-50 border-slate-100">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-bold text-white transition-all shadow-lg bg-slate-800 rounded-xl hover:bg-slate-900 shadow-slate-200"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
      {label}
    </p>
    <p className="text-sm font-semibold text-slate-700">{value || "---"}</p>
  </div>
);

export default LeaveDetailModal;
