import { useEffect, useState } from "react";
import { X, Save, Megaphone } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "../../../hooks/use-toast";
import {
  HandleCreateNotice,
  HandleUpdateNotice,
} from "../../../redux/Thunks/NoticeThunk";
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
  }, [dispatch, isOpen, departments.length, employees.length, fetchData]);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    audience: "Department-Specific",
    departments: [],    
    employee: [],      
    channels: ["system"],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Xử lý dữ liệu khi edit
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        title: initialData.title || "",
        content: initialData.content || "",
        audience: initialData.audience || "Department-Specific",
        departments: initialData.departments?.map(d => d._id || d) || [],
        employee: initialData.employees?.map(e => e._id || e) || [],
        channels: initialData.channels || ["system"],
      });
    } else if (isOpen) {
      // reset khi mở modal create
      setFormData({
        title: "",
        content: "",
        audience: "Department-Specific",
        departments: [],
        employee: [],
        channels: "system",
      });
    }
  }, [mode, initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Chuẩn bị payload theo audience
      let payload = {
        title: formData.title,
        content: formData.content,
        audience: formData.audience,
        channels: formData.channels,
      };

      if (formData.audience === "Department-Specific") {
        payload.departments = formData.departments;
        payload.employee = [];
      } else if (formData.audience === "Employee-Specific") {
        payload.employee = formData.employee;
        payload.departments = [];
      } else if (formData.audience === "ALL_EMPLOYEES") {
        payload.departments = [];
        payload.employee = employees.map(emp => emp._id);
      }

      console.log("Payload gửi lên:", payload);

      if (mode === "create") {
        await dispatch(HandleCreateNotice(payload)).unwrap();
        toast({ title: "Thành công", description: "Đã đăng thông báo mới!" });
      } else {
        await dispatch(
          HandleUpdateNotice({
            noticeID: initialData._id,
            UpdatedData: payload,
          })
        ).unwrap();
        toast({ title: "Thành công", description: "Đã cập nhật thông báo!" });
      }

      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error?.message || "Thao tác thất bại",
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
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-full hover:bg-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="ml-1 text-sm font-bold uppercase text-slate-600">
              Tiêu đề
            </label>
            <input
              required
              className="w-full px-4 py-3 transition-all border-none outline-none bg-slate-50 rounded-xl focus:ring-2 ring-blue-500"
              placeholder="Nhập tiêu đề thông báo..."
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="ml-1 text-sm font-bold uppercase text-slate-600">
                Hình thức gửi
              </label>
              <select
                className="w-full px-4 py-3 border-none outline-none bg-slate-50 rounded-xl focus:ring-2 ring-blue-500"
                value={formData.channels}
                onChange={(e) =>
                  setFormData({ ...formData, channels: [e.target.value]})
                }
              >
                <option value="system">Gửi qua thông báo hệ thống</option>
                <option value="mail">Gửi qua email</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-sm font-bold uppercase text-slate-600">
                Đối tượng nhận
              </label>
              <select
                className="w-full px-4 py-3 border-none outline-none bg-slate-50 rounded-xl focus:ring-2 ring-blue-500"
                value={formData.audience}
                onChange={(e) => {
                  const newAudience = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    audience: newAudience,
                    // clear lựa chọn cũ khi đổi loại
                    departments: newAudience === "Department-Specific" ? prev.departments : [],
                    employee: newAudience === "Employee-Specific" ? prev.employee : [],
                  }));
                }}
              >
                <option value="Department-Specific">Theo phòng ban</option>
                <option value="Employee-Specific">Cá nhân nhân viên</option>
                <option value="ALL_EMPLOYEES">Tất cả CB-VN</option>
              </select>
            </div>
          </div>

          {/* Phần chọn phòng ban / nhân viên */}
          {formData.audience === "Department-Specific" && (
            <div className="space-y-2">
              <label className="ml-1 text-sm font-bold uppercase text-slate-600">
                Chọn phòng ban (có thể chọn nhiều)
              </label>
              <div className="w-full p-4 overflow-y-auto border-none bg-slate-50 rounded-xl h-44 focus-within:ring-2 ring-blue-500">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {departments?.map((dept) => (
                    <label key={dept._id} className="flex items-center gap-3 p-2 transition-colors cursor-pointer hover:bg-white rounded-lg">
                      <input
                        type="checkbox"
                        className="w-5 h-5 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                        checked={formData.departments.includes(dept._id)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const newDepts = checked
                            ? [...formData.departments, dept._id]
                            : formData.departments.filter((id) => id !== dept._id);
                          setFormData({ ...formData, departments: newDepts });
                        }}
                      />
                      <span className="text-sm font-medium text-slate-700">{dept.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-500 italic">Đã chọn: {formData.departments.length} phòng ban</p>
            </div>
          )}

          {formData.audience === "Employee-Specific" && (
            <div className="space-y-2">
              <label className="ml-1 text-sm font-bold uppercase text-slate-600">
                Chọn nhân viên (có thể chọn nhiều)
              </label>
              <div className="w-full p-4 overflow-y-auto border-none bg-slate-50 rounded-xl h-44 focus-within:ring-2 ring-blue-500">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {employees?.map((emp) => (
                    <label key={emp._id} className="flex items-center gap-3 p-2 transition-colors cursor-pointer hover:bg-white rounded-lg">
                      <input
                        type="checkbox"
                        className="w-5 h-5 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                        checked={formData.employee.includes(emp._id)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const newEmps = checked
                            ? [...formData.employee, emp._id]
                            : formData.employee.filter((id) => id !== emp._id);
                          setFormData({ ...formData, employee: newEmps });
                        }}
                      />
                      <span className="text-sm font-medium text-slate-700">
                        {emp.firstname} {emp.lastname}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-500 italic">Đã chọn: {formData.employee.length} nhân viên</p>
            </div>
          )}

          {formData.audience === "ALL_EMPLOYEES" && (
            <div className="space-y-2">
              <label className="ml-1 text-sm font-bold uppercase text-slate-600">Đối tượng nhận</label>
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-blue-200 bg-blue-50 rounded-2xl">
                <div className="p-3 mb-3 bg-blue-500 text-white rounded-full animate-pulse">
                  <Megaphone size={28} />
                </div>
                <h4 className="text-lg font-bold text-blue-800">Gửi tới Toàn thể CB-NV</h4>
                <p className="text-sm text-blue-600 text-center max-w-[300px] mt-1">
                  Thông báo này sẽ được gửi đến tất cả <strong>{employees.length}</strong> nhân viên trên hệ thống.
                </p>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <label className="ml-1 text-sm font-bold uppercase text-slate-600">
              Nội dung
            </label>
            <textarea
              required
              rows={5}
              className="w-full px-4 py-3 transition-all border-none outline-none resize-none bg-slate-50 rounded-xl focus:ring-2 ring-blue-500"
              placeholder="Nhập nội dung chi tiết thông báo..."
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
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
              {isSubmitting
                ? "Đang xử lý..."
                : mode === "create"
                ? "Đăng thông báo"
                : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoticeActionModal;