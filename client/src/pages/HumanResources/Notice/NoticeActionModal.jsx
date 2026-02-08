import { useEffect, useState } from "react";
import { X, Save, Megaphone} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "../../../hooks/use-toast";
import { HandleCreateNotice, HandleUpdateNotice } from "../../../redux/Thunks/NoticeThunk";
import { HandleGetHRDepartments } from "../../../redux/Thunks/HRDepartmentPageThunk";
import { HandleGetHREmployees } from "../../../redux/Thunks/HREmployeesThunk";


const NoticeActionModal = ({ isOpen, onClose, mode = "create", initialData = null }) => {
  const dispatch = useDispatch();
  const { fetchData } = useSelector((state) => state.NoticeReducer);
 const HRDepartmentState = useSelector((state) => state.HRDepartmentPageReducer);
   const departments = HRDepartmentState?.data || [];
   const HREmployeeState = useSelector((state) => state.HREmployeesPageReducer);
   const employees = HREmployeeState?.data || [];
   useEffect(() => {
    if (isOpen) {
      if (departments.length === 0) {
        dispatch(HandleGetHRDepartments({ apiroute: "GETALL" }));
      }
      if (employees.length === 0) {
        dispatch(HandleGetHREmployees({ apiroute: "GETALL" }));
      }
    }
  }, [dispatch, isOpen, departments.length, employees.length,fetchData]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    audience: "Department-Specific",
    department: "",
    employee: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        title: initialData.title || "",
        content: initialData.content || "",
        audience: initialData.audience || "Department-Specific",
        department: initialData.department?._id || initialData.department || "",
        employee: initialData.employee?._id || initialData.employee || "",
      });
    } else {
      setFormData({
        title: "",
        content: "",
        audience: "Department-Specific",
        department: "",
        employee: "",
      });
    }
  }, [mode, initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
      };

      if (mode === "create") {
        await dispatch(HandleCreateNotice(payload)).unwrap();
        toast({ title: "Thành công", description: "Đã đăng thông báo mới!" });
      } else {
        await dispatch(HandleUpdateNotice({ 
            noticeID: initialData._id, 
            UpdatedData: formData 
        })).unwrap();
        toast({ title: "Thành công", description: "Đã cập nhật thông báo!" });
      }
      onClose();
    } catch (error) {
      toast({ 
        variant: "destructive", 
        title: "Lỗi", 
        description: error?.message || "Thao tác thất bại" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden duration-200 bg-white shadow-2xl rounded-3xl animate-in zoom-in">
        <div className="flex items-center justify-between p-6 border-b bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 text-white bg-blue-600 rounded-xl">
              <Megaphone size={20} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              {mode === "create" ? "Tạo thông báo mới" : "Chỉnh sửa thông báo"}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 transition-colors rounded-full hover:bg-slate-200">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="ml-1 text-sm font-bold uppercase text-slate-600">Tiêu đề</label>
            <input
              required
              className="w-full px-4 py-3 transition-all border-none outline-none bg-slate-50 rounded-xl focus:ring-2 ring-blue-500"
              placeholder="Nhập tiêu đề thông báo..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="ml-1 text-sm font-bold uppercase text-slate-600">Đối tượng nhận</label>
              <select
                className="w-full px-4 py-3 border-none outline-none bg-slate-50 rounded-xl focus:ring-2 ring-blue-500"
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
              >
                <option value="Department-Specific">Theo phòng ban</option>
                <option value="Employee-Specific">Cá nhân nhân viên</option>
              </select>
            </div>

            {formData.audience === "Department-Specific" ? (
              <div className="space-y-2">
                <label className="ml-1 text-sm font-bold uppercase text-slate-600">Chọn phòng ban</label>
                <select
                  required
                  className="w-full px-4 py-3 border-none outline-none bg-slate-50 rounded-xl focus:ring-2 ring-blue-500"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  <option value="">-- Chọn phòng ban --</option>
                  {departments?.map(dept => (
                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="ml-1 text-sm font-bold uppercase text-slate-600">Chọn nhân viên</label>
                <select
                  required
                  className="w-full px-4 py-3 border-none outline-none bg-slate-50 rounded-xl focus:ring-2 ring-blue-500"
                  value={formData.employee}
                  onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
                >
                  <option value="">-- Chọn nhân viên --</option>
                  {employees?.map(emp => (
                    <option key={emp._id} value={emp._id}>{emp.firstname} {emp.lastname}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-sm font-bold uppercase text-slate-600">Nội dung</label>
            <textarea
              required
              rows={5}
              className="w-full px-4 py-3 transition-all border-none outline-none resize-none bg-slate-50 rounded-xl focus:ring-2 ring-blue-500"
              placeholder="Nhập nội dung chi tiết thông báo..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 font-bold transition-all text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
            >
              Hủy
            </button>
            <button
              disabled={isSubmitting}
              type="submit"
              className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-bold text-white transition-all bg-blue-600 shadow-lg rounded-xl hover:bg-blue-700 shadow-blue-100 disabled:opacity-50"
            >
              <Save size={18} />
              {isSubmitting ? "Đang xử lý..." : mode === "create" ? "Đăng thông báo" : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoticeActionModal;