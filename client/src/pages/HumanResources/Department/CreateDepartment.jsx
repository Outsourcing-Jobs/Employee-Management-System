import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Plus, 
  Briefcase, 
  FileText, 
  Save, 
  Loader2, 
  X 
} from "lucide-react";

import { useToast } from "../../../hooks/use-toast";
import { HandlePostHRDepartments } from "../../../redux/Thunks/HRDepartmentPageThunk";

const CreateDepartment = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.description.trim()) {
      return toast({
        variant: "destructive",
        title: "Thông tin chưa đầy đủ",
        description: "Vui lòng nhập tên và mô tả phòng ban.",
      });
    }

    setIsLoading(true);
    try {
      await dispatch(
        HandlePostHRDepartments({ apiroute: "CREATE", data: formData })
      ).unwrap();

      toast({
        title: "Thành công",
        description: `Đã tạo phòng ban ${formData.name} mới.`,
      });

      setFormData({ name: "", description: "" });
      setOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi tạo phòng ban",
        description: error?.message || "Đã có lỗi xảy ra, vui lòng thử lại.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 font-bold text-white transition-all bg-blue-600 shadow-lg rounded-xl hover:bg-blue-700 shadow-blue-100/30 active:scale-95">
          <Plus size={18} />
          <span className="hidden sm:inline">Thêm phòng ban</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md bg-white border-none shadow-2xl rounded-[32px] p-0 overflow-hidden">

        <div className="p-8 text-white bg-blue-600">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl font-black">
              <Briefcase size={28} /> Thiết lập phòng ban
            </DialogTitle>
            <p className="mt-1 text-sm font-medium text-blue-100">
              Tạo không gian làm việc mới cho đội ngũ của bạn
            </p>
          </DialogHeader>
        </div>

        <form onSubmit={handleCreate} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
              Tên phòng ban
            </label>
            <div className="relative">
              <Briefcase className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400" size={16} />
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ví dụ: Phòng Phát triển Phần mềm"
                className="w-full py-3 pl-10 pr-4 text-sm font-bold transition-all border-none outline-none bg-slate-50 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-700"
              />
            </div>
          </div>


          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
              Mô tả nhiệm vụ
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-slate-400" size={16} />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Mô tả ngắn gọn chức năng của phòng..."
                className="w-full h-32 py-3 pl-10 pr-4 text-sm font-bold transition-all border-none outline-none resize-none bg-slate-50 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-700"
              />
            </div>
          </div>


          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 py-4 text-sm font-bold transition-all text-slate-500 bg-slate-100 rounded-2xl hover:bg-slate-200"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center flex-1 gap-2 py-4 font-black text-white transition-all bg-blue-600 shadow-lg rounded-2xl hover:bg-blue-700 shadow-blue-100 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Save size={20} />
              )}
              {isLoading ? "Đang tạo..." : "Xác nhận tạo"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDepartment;