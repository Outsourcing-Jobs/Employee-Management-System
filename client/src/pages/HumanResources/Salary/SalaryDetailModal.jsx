import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, User, Calendar, CreditCard, Banknote, ShieldCheck, XCircle, PlusCircle, MinusCircle, Calculator } from "lucide-react";
import { HandleGetSalaryDetail } from "../../../redux/Thunks/SalaryThunk";

export const SalaryDetailModal = ({ salaryID }) => {
  const dispatch = useDispatch();
  const { currentSalary, isDetailLoading } = useSelector((state) => state.SalaryReducer);

  const onOpenModal = () => {
    dispatch(HandleGetSalaryDetail(salaryID));
  };

  return (
    <Dialog onOpenChange={(open) => open && onOpenModal()}>
      <DialogTrigger asChild>
        <button className="p-2 text-blue-600 transition-all rounded-lg hover:bg-blue-50">
          <FileText size={18} />
        </button>
      </DialogTrigger>
      
      <DialogContent className="max-w-xl bg-white border-none shadow-2xl rounded-3xl">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-800">
            <Calculator className="text-blue-600" /> Chi tiết cách tính lương
          </DialogTitle>
        </DialogHeader>

        {isDetailLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-8 h-8 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            <p className="text-sm font-medium text-slate-400">Đang tính toán dữ liệu...</p>
          </div>
        ) : currentSalary ? (
          <div className="pt-4 space-y-6">

            <div className="flex items-center gap-4 p-4 border rounded-2xl bg-slate-50 border-slate-100">
              <div className="flex items-center justify-center w-12 h-12 text-blue-600 bg-white rounded-full shadow-sm">
                <User size={24} />
              </div>
              <div>
                <h4 className="text-lg font-black leading-tight text-slate-800">
                  {currentSalary.employee?.firstname} {currentSalary.employee?.lastname}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Calendar size={14} /> Tháng {currentSalary.salaryMonth}/{currentSalary.salaryYear}</span>
                  <span className="flex items-center gap-1 font-bold tracking-wider text-blue-600">
                     {currentSalary.workingDays} NGÀY CÔNG
                  </span>
                </div>
              </div>
            </div>

    
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase text-slate-400 ml-1">Diễn giải dòng tiền</p>
              
     
              <div className="flex items-center justify-between p-4 transition-colors border rounded-2xl border-slate-100 hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 text-blue-600 rounded-lg bg-blue-50"><Banknote size={18}/></div>
                  <span className="text-sm font-medium text-slate-600">Lương cơ bản</span>
                </div>
                <span className="font-bold text-slate-800">{currentSalary.basicpay?.toLocaleString()} {currentSalary.currency}</span>
              </div>

         
              <div className="flex items-center justify-between p-4 transition-colors border rounded-2xl border-slate-100 hover:bg-green-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 text-green-600 rounded-lg bg-green-50"><PlusCircle size={18}/></div>
                  <span className="text-sm font-medium text-slate-600">Tiền thưởng (Bonuses)</span>
                </div>
                <span className="font-bold text-green-600">+{currentSalary.bonuses?.toLocaleString()} {currentSalary.currency}</span>
              </div>

     
              <div className="flex items-center justify-between p-4 transition-colors border rounded-2xl border-slate-100 hover:bg-red-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 text-red-600 rounded-lg bg-red-50"><MinusCircle size={18}/></div>
                  <span className="text-sm font-medium text-slate-600">Khấu trừ (Deductions)</span>
                </div>
                <span className="font-bold text-red-600">-{currentSalary.deductions?.toLocaleString()} {currentSalary.currency}</span>
              </div>
            </div>

  
            <div className="relative flex items-center justify-between p-6 overflow-hidden text-white bg-blue-600 shadow-xl rounded-3xl shadow-blue-100">
               {/* Trang trí nền */}
              <div className="absolute text-white -right-4 -bottom-4 opacity-10 rotate-12">
                <CreditCard size={120} />
              </div>

              <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase opacity-70 mb-1">Tổng thực nhận (Net pay)</p>
                <p className="text-4xl font-black tracking-tight">
                  {currentSalary.netpay?.toLocaleString()} <span className="text-xl font-medium">{currentSalary.currency}</span>
                </p>
              </div>
              
              <div className="relative z-10 flex flex-col items-end gap-2">
                 <span className={`flex items-center gap-1 text-[10px] font-black uppercase px-3 py-1.5 rounded-full shadow-inner ${
                    currentSalary.status === "Paid" ? "bg-white/20 text-white" : "bg-amber-400 text-amber-900"
                  }`}>
                    {currentSalary.status === "Paid" ? <ShieldCheck size={14} /> : <Clock size={14} />}
                    {currentSalary.status === "Paid" ? "Đã trả lương" : "Chờ thanh toán"}
                  </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-10 italic text-center text-slate-400">Không tìm thấy dữ liệu tính toán.</div>
        )}
      </DialogContent>
    </Dialog>
  );
};