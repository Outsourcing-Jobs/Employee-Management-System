import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  UserPlus, 
  Mail, 
  Phone, 
  Lock, 
  User, 
  Save, 
  Loader2, 
  ShieldCheck
} from "lucide-react";
import { HandlePostHREmployees } from "../../../redux/Thunks/HREmployeesThunk";
import { toast } from "../../../hooks/use-toast";

const AddEmployeeModal = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const DEFAULT_PASSWORD = "Employee@123";

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    contactnumber: "",
    password: DEFAULT_PASSWORD,
    confirmPassword: DEFAULT_PASSWORD,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await dispatch(HandlePostHREmployees({ 
        apiroute: 'ADDEMPLOYEE', 
        data: {
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            contactnumber: formData.contactnumber,
            password: formData.password
        } 
      })).unwrap();

      toast({
        title: "Thành công",
        description: "Đã đăng ký nhân viên mới vào hệ thống.",
      });

  
      setFormData({ 
        firstname: "", 
        lastname: "", 
        email: "", 
        contactnumber: "", 
        password: DEFAULT_PASSWORD, 
        confirmPassword: DEFAULT_PASSWORD 
      });
      setOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi đăng ký",
        description: error?.message || "Vui lòng kiểm tra lại thông tin.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 font-bold text-white transition-all bg-blue-600 shadow-lg rounded-xl hover:bg-blue-700 shadow-blue-100/30 active:scale-95">
          <UserPlus size={20} /> 
          <span className="hidden sm:inline">Thêm nhân viên</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg bg-white border-none shadow-2xl rounded-[32px] p-0 overflow-hidden">
        <div className="p-8 text-white bg-blue-600">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl font-black">
              <UserPlus size={28} /> Đăng ký nhân sự
            </DialogTitle>
            <p className="mt-1 text-sm font-medium text-blue-100">
              Mật khẩu mặc định hệ thống: <span className="font-bold underline">{DEFAULT_PASSWORD}</span>
            </p>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-wider">Họ và tên đệm</label>
              <div className="relative">
                <User className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400" size={16} />
                <input
                  required
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="w-full py-3 pl-10 pr-4 text-sm font-bold transition-all border-none outline-none bg-slate-50 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-700"
                  placeholder="Nguyễn Văn"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-wider">Tên</label>
              <input
                required
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm font-bold transition-all border-none outline-none bg-slate-50 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-700"
                placeholder="An"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-wider">Email công việc</label>
              <div className="relative">
                <Mail className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400" size={16} />
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full py-3 pl-10 pr-4 text-sm font-bold transition-all border-none outline-none bg-slate-50 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-700"
                  placeholder="an.nguyen@email.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-wider">Số điện thoại</label>
              <div className="relative">
                <Phone className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400" size={16} />
                <input
                  required
                  type="tel"
                  name="contactnumber"
                  value={formData.contactnumber}
                  onChange={handleChange}
                  className="w-full py-3 pl-10 pr-4 text-sm font-bold transition-all border-none outline-none bg-slate-50 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-700"
                  placeholder="09xxxxxxxx"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pb-2">

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-wider">Mật khẩu (Mặc định)</label>
              <div className="relative">
                <Lock className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400" size={16} />
                <input
                  disabled
                  type="text" 
                  name="password"
                  value={formData.password}
                  className="w-full py-3 pl-10 pr-4 text-sm italic font-bold border-none outline-none cursor-not-allowed bg-slate-100 rounded-xl text-slate-400"
                />
              </div>
            </div>


            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-wider">Xác nhận</label>
              <div className="relative">
                <ShieldCheck className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400" size={16} />
                <input
                  disabled
                  type="text"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  className="w-full py-3 pl-10 pr-4 text-sm italic font-bold border-none outline-none cursor-not-allowed bg-slate-100 rounded-xl text-slate-400"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
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
              {isLoading ? "Đang xử lý..." : "Xác nhận lưu"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeModal;