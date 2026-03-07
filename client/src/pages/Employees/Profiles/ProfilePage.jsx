import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  User, Mail, Phone, MapPin, Briefcase, 
  Calendar, ShieldCheck, Edit3, Save, X,
  Building2, CreditCard, Clock, CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { HandleGetMyProfile, HandleUpdateMyProfile } from '../../../redux/Thunks/HREmployeesThunk';
import { toast } from '../../../hooks/use-toast';


const ProfilePage = () => {
  const dispatch = useDispatch();

  const hrState = useSelector((state) => 
    state.HREmployeesPageReducer
  );
 
  const employee = hrState?.employeeData?.data || null;
  const isLoading = hrState?.isLoading || false;
  const error = hrState?.error?.status ? hrState.error : null;

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    contactnumber: '', 
    address: '',
    firstname: '',
    lastname: '',
  });

  useEffect(() => {
    dispatch(HandleGetMyProfile());
  }, [dispatch]);

  useEffect(() => {
    if (employee) {
      setFormData({
        contactnumber: employee.contactnumber || employee.phone || '',
        address: employee.address || '',
        firstname: employee.firstname || '',
        lastname: employee.lastname || '',
      });
    }
  }, [employee]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (employee) {
      setFormData({
        contactnumber: employee.contactnumber || employee.phone || '',
        address: employee.address || '',
        firstname: employee.firstname || '',
        lastname: employee.lastname || '',
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await dispatch(HandleUpdateMyProfile(formData)).unwrap();
      setIsEditing(false);
      toast({ title: "Thành công", description: "Cập nhật hồ sơ" });
      dispatch(HandleGetMyProfile());
    } catch (err) {
     toast({
             variant: "destructive",
             title: "Lỗi",
             description: "Không thể cập nhật hồ sơ. Vui lòng thử lại.",
           });
    } finally {
      setIsSaving(false);
    }
  };


  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading && !employee) {
    return (
      <div className="flex flex-col items-center justify-center h-screen ">
        <div className="w-10 h-10 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        <p className="font-semibold text-blue-600">Đang tải hồ sơ...</p>
      </div>
    );
  }

  if (error && !employee) {
    return (
      <div className="flex flex-col items-center justify-center h-screen ">
        <AlertCircle size={48} className="text-red-500" />
        <p className="font-semibold text-red-600">Không thể tải hồ sơ. Vui lòng thử lại.</p>
        <button 
          onClick={() => dispatch(HandleGetMyProfile())}
          className="px-4 py-2 text-white bg-blue-600 rounded-xl hover:bg-blue-700"
        >
          Tải lại
        </button>
      </div>
    );
  }

  const fullName = `${employee?.firstname || ''} ${employee?.lastname || ''}`.trim() || 'N/A';

  return (
    <div className="min-h-screen md:p-8">
      <div className="max-w-4xl mx-auto">

        {/* === HEADER CARD === */}
        <div className="mb-6 overflow-hidden bg-white border shadow-sm rounded-3xl border-slate-200">
          <div className="relative h-36 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700">
            <div className="absolute inset-0 opacity-30"></div>
          </div>
          <div className="px-6 pb-6 md:px-8 md:pb-8">
            <div className="relative flex flex-col items-start justify-between gap-4 -mt-14 md:flex-row md:items-end">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div className="p-1.5 bg-white shadow-lg rounded-2xl">
                  <div className="flex items-center justify-center w-24 h-24 border bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl border-slate-100">
                    <User size={48} className="text-slate-400" />
                  </div>
                </div>
                <div className="mt-2 text-center sm:text-left">
                  <h1 className="text-2xl font-bold text-slate-800">{fullName}</h1>
                  <p className="flex items-center justify-center gap-1.5 font-medium text-slate-500 sm:justify-start">
                    <ShieldCheck size={16} className="text-blue-500" />
                    Mã NV: <span className="font-semibold text-blue-600">{employee?._id?.slice(-6).toUpperCase() || 'N/A'}</span>
                  </p>
                </div>
              </div>

              <div className="flex w-full gap-2 sm:w-auto">
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center w-full gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm sm:w-auto"
                  >
                    <Edit3 size={18} /> Chỉnh sửa
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-50"
                    >
                      <X size={18} /> Hủy
                    </button>
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                    >
                      {isSaving ? (
                        <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                      ) : (
                        <Save size={18} />
                      )}
                      {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* === BODY === */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          {/* --- CỘT TRÁI --- */}
          <div className="space-y-6 md:col-span-1">
            <div className="p-6 bg-white border shadow-sm rounded-3xl border-slate-200">
              <h3 className="flex items-center gap-2 mb-5 text-base font-bold text-slate-800">
                <Briefcase size={18} className="text-blue-600" /> Công việc
              </h3>
              <div className="space-y-4">
                <InfoItem 
                  icon={<Building2 size={16} className="text-slate-400" />}
                  label="Phòng ban" 
                  value={employee?.departmentName || employee?.department || 'Chưa cập nhật'} 
                />
                <InfoItem 
                  icon={<Calendar size={16} className="text-slate-400" />}
                  label="Ngày gia nhập" 
                  value={formatDate(employee?.joiningDate || employee?.createdAt)} 
                />
                <InfoItem 
                  icon={<CreditCard size={16} className="text-slate-400" />}
                  label="Lương" 
                  value={employee?.salary?.length > 0 
                    ? `${Number(employee.salary[employee.salary.length - 1]?.amount || 0).toLocaleString('vi-VN')} VNĐ` 
                    : 'Chưa cập nhật'
                  } 
                />
              </div>
            </div>

            <div className="p-6 bg-white border shadow-sm rounded-3xl border-slate-200">
              <h3 className="flex items-center gap-2 mb-5 text-base font-bold text-slate-800">
                <Clock size={18} className="text-green-600" /> Trạng thái
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold tracking-wider uppercase text-slate-400">Tình trạng</label>
                  <div className="mt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-green-50 text-green-700">
                      <CheckCircle2 size={14} />
                      Đang hoạt động
                    </span>
                  </div>
                </div>
                <InfoItem 
                  label="Đơn nghỉ phép" 
                  value={`${employee?.leaverequest?.length || 0} đơn`} 
                />
                <InfoItem 
                  label="Thông báo" 
                  value={`${employee?.notice?.length || 0} thông báo`} 
                />
              </div>
            </div>
          </div>

          {/* --- CỘT PHẢI --- */}
          <div className="space-y-6 md:col-span-2">
            <div className="p-6 bg-white border shadow-sm md:p-8 rounded-3xl border-slate-200">
              <h3 className="mb-6 text-lg font-bold text-slate-800">Thông tin cá nhân</h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <EditableField
                  label="Họ"
                  name="firstname"
                  icon={<User size={20} />}
                  value={formData.firstname}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  placeholder="Nhập họ..."
                />
                <EditableField
                  label="Tên"
                  name="lastname"
                  icon={<User size={20} />}
                  value={formData.lastname}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  placeholder="Nhập tên..."
                />
              </div>
            </div>

            <div className="p-6 bg-white border shadow-sm md:p-8 rounded-3xl border-slate-200">
              <h3 className="mb-6 text-lg font-bold text-slate-800">Thông tin liên lạc</h3>
              <div className="space-y-5">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-500">Địa chỉ Email</label>
                  <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-500">
                    <Mail size={20} />
                    <span className="font-medium">{employee?.email || 'N/A'}</span>
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-200 text-slate-500 ml-auto">Không thể sửa</span>
                  </div>
                </div>

                <EditableField
                  label="Số điện thoại"
                  name="contactnumber"
                  icon={<Phone size={20} />}
                  value={formData.contactnumber}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại..."
                />

                <EditableField
                  label="Địa chỉ thường trú"
                  name="address"
                  icon={<MapPin size={20} />}
                  value={formData.address}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ của bạn..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value, icon }) => (
  <div>
    <label className="text-xs font-bold tracking-wider uppercase text-slate-400">{label}</label>
    <div className="flex items-center gap-2 mt-1 font-medium text-slate-700">
      {icon}
      <span>{value}</span>
    </div>
  </div>
);

const EditableField = ({ label, name, icon, value, isEditing, onChange, placeholder }) => (
  <div>
    <label className="block mb-2 text-sm font-semibold text-slate-500">{label}</label>
    <div className={`flex items-center gap-3 p-3.5 border rounded-2xl transition-all ${
      isEditing 
        ? 'border-blue-500 ring-4 ring-blue-50 bg-white' 
        : 'border-slate-100 bg-slate-50'
    }`}>
      <span className={isEditing ? 'text-blue-500' : 'text-slate-400'}>{icon}</span>
      <input 
        type="text"
        name={name}
        disabled={!isEditing}
        value={value}
        onChange={onChange}
        className="w-full font-medium bg-transparent outline-none text-slate-700 disabled:cursor-not-allowed placeholder:text-slate-300"
        placeholder={placeholder}
      />
    </div>
  </div>
);

export default ProfilePage;