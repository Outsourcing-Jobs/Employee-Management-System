import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog"; 
import { AlertTriangle, Trash2, CheckCircle, XCircle, Loader2 } from "lucide-react";

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  status, 
  employeeName, 
  isLoading,
  title,
  description 
}) => {
  
  const isDanger = status === "Rejected" || title?.toLowerCase().includes("xóa");
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white border-none shadow-2xl rounded-[32px] p-0 overflow-hidden">
        
        <div className={`flex justify-center pt-8 pb-4 ${isDanger ? "bg-red-50" : "bg-blue-50"}`}>
          <div className={`p-4 rounded-full ${isDanger ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
            {isDanger ? <AlertTriangle size={40} /> : <CheckCircle size={40} />}
          </div>
        </div>

        <div className="px-8 pt-6 pb-2 text-center">
        
          
          <div className="mt-4">
            <p className="text-sm font-medium leading-relaxed text-slate-500">
              {description || (
                <>
                  Bạn có chắc chắn muốn thực hiện thao tác này đối với nhân viên 
                  <span className="block mt-1 text-base italic font-black text-slate-800">
                    " {employeeName} "
                  </span>
                  Hành động này không thể hoàn tác.
                </>
              )}
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-row items-center gap-3 px-8 pt-6 pb-8 sm:justify-center">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-3.5 text-sm font-bold transition-all bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-black text-white transition-all rounded-2xl shadow-lg shadow-opacity-20 ${
              isDanger 
                ? "bg-red-600 hover:bg-red-700 shadow-red-100" 
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
            } disabled:opacity-70`}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              isDanger ? <Trash2 size={18} /> : <CheckCircle size={18} />
            )}
            {isLoading ? "Đang xử lý..." : (isDanger ? "Xác nhận xóa" : "Xác nhận")}
          </button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
};

export default ConfirmModal;