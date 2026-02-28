import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Trash2,
  Edit,
  Eye,
  UserPlus,
  Users,
  UserCheck,
  UserMinus,
  Download,
  Briefcase,
  User,
} from "lucide-react";

import StatCard from "../../../components/common/StatCard";
import { toast } from "../../../hooks/use-toast";
import {
  HandleDeleteHREmployees,
  HandleGetHREmployees,
} from "../../../redux/Thunks/HREmployeesThunk";
import { HandleGetReport } from "../../../redux/Thunks/ReportThunk";
import AddEmployeeModal from "./AddEmployeeModal";
import ConfirmModal from "./ConfirmModal";
import EmployeeDetailModal from "./EmployeeDetailModal";
import { HandleGetHRDepartments } from "../../../redux/Thunks/HRDepartmentPageThunk";

const EmployeesPage = () => {
  const dispatch = useDispatch();
  const {
    data: employees,
    isLoading,
    fetchData,
  } = useSelector((state) => state.HREmployeesPageReducer);
  const { data :departments } = useSelector((state) => state.HRDepartmentPageReducer);
  const [searchFilters, setSearchFilters] = useState({
    name: "",
    email: "",
    dept: "",
    phone: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const itemsPerPage = 10;

  const table_headings = [
    "Họ và tên ",
    "Email",
    "Phòng ban",
    "Số điện thoại",
    "Hành động ",
  ];

  useEffect(() => {
    if (fetchData || !employees) {
      dispatch(HandleGetHREmployees({ apiroute: "GETALL" }));
    }
    dispatch(HandleGetHRDepartments({ apiroute: "GETALL" }));
  }, [fetchData, dispatch, employees]);

  const stats = useMemo(() => {
    const emps = employees || [];
    return {
      total: emps.length,
      active: emps.filter((e) => e.department).length,
      noDept: emps.filter((e) => !e.department).length,
    };
  }, [employees]);

  const filteredData = useMemo(() => {
    return (
      employees?.filter((emp) => {
        const fName = searchFilters.name.toLowerCase();
        const fEmail = searchFilters.email.toLowerCase();
        const fDept = searchFilters.dept.toLowerCase();
        const fPhone = searchFilters.phone;

        const fullName = `${emp.firstname} ${emp.lastname}`.toLowerCase();
        const email = (emp.email || "").toLowerCase();
        const deptName = (emp.department?.name || "").toLowerCase();
      
        const phone = emp.contactnumber || "";

        const matchName = fullName.includes(fName);
        const matchEmail = email.includes(fEmail);
        const matchPhone = phone.includes(fPhone);

        const matchDept = fDept === "" ? true : deptName === fDept;

        return matchName && matchEmail && matchDept && matchPhone;
      }) || []
    );
  }, [employees, searchFilters]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const currentTableData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [currentPage, filteredData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmployee?._id) return;
    setIsSubmitting(true);
    try {
      await dispatch(
        HandleDeleteHREmployees({ apiroute: `DELETE.${selectedEmployee._id}` })
      ).unwrap();
      toast({ title: "Thành công", description: "Đã xóa nhân viên" });
      setModalType(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể xóa nhân viên",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6 pr-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl font-black tracking-tight text-slate-800">
          Nhân viên
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              dispatch(
                HandleGetReport({
                  apiroute: "EXPORT_ALL_EMPLOYEES",
                  responseType: "blob",
                })
              )
            }
            className="flex items-center gap-2 px-4 py-2 font-bold text-white bg-green-600 shadow-lg rounded-xl hover:bg-green-700 shadow-green-100/30"
          >
            <Download size={18} />{" "}
            <span className="hidden sm:inline">Xuất báo cáo</span>
          </button>
          <AddEmployeeModal />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          icon={<Users className="text-blue-600" />}
          label="Tổng nhân sự"
          value={stats.total}
          color="bg-blue-50"
        />
        <StatCard
          icon={<UserCheck className="text-green-600" />}
          label="Đã xếp phòng"
          value={stats.active}
          color="bg-green-50"
        />
        <StatCard
          icon={<UserMinus className="text-amber-600" />}
          label="Chưa xếp phòng"
          value={stats.noDept}
          color="bg-amber-50"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 bg-white border shadow-sm md:grid-cols-2 lg:grid-cols-4 rounded-2xl border-slate-100">
        <div className="relative">
          <User
            className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400"
            size={14}
          />
          <input
            name="name"
            placeholder="Lọc theo tên..."
            className="w-full py-2 pr-4 text-xs border-none rounded-lg outline-none pl-9 bg-slate-50 focus:ring-2 focus:ring-blue-500"
            value={searchFilters.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="relative">
          <Mail
            className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400"
            size={14}
          />
          <input
            name="email"
            placeholder="Lọc theo email..."
            className="w-full py-2 pr-4 text-xs border-none rounded-lg outline-none pl-9 bg-slate-50 focus:ring-2 focus:ring-blue-500"
            value={searchFilters.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="relative">
          <Phone
            className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400"
            size={14}
          />
          <input
            name="phone"
            placeholder="Lọc số điện thoại..."
            className="w-full py-2 pr-4 text-xs border-none rounded-lg outline-none pl-9 bg-slate-50 focus:ring-2 focus:ring-blue-500"
            value={searchFilters.phone}
            onChange={handleInputChange}
          />
        </div>
        <div className="relative">
          <Briefcase
            className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400"
            size={14}
          />
          <select
            name="dept"
            className="w-full py-2 pr-4 text-xs font-medium border-none rounded-lg outline-none appearance-none cursor-pointer pl-9 bg-slate-50 focus:ring-2 focus:ring-blue-500 text-slate-600"
            value={searchFilters.dept}
            onChange={handleInputChange}
          >
            <option value="">Tất cả phòng ban</option>
            {departments?.map((dept) => (
              <option key={dept._id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
          <div className="absolute -translate-y-1/2 pointer-events-none right-3 top-1/2 text-slate-400">
            <ChevronLeft size={12} className="-rotate-90" />
          </div>
        </div>

       
      </div>

      <div className="overflow-hidden bg-white border shadow-sm border-slate-100 rounded-3xl">
        <table className="w-full text-left">
          <thead className="border-b bg-slate-50 border-slate-100">
            <tr>
              {table_headings.map((h, i) => (
                <th
                  key={i}
                  className="px-6 py-4 text-[12px] uppercase font-black text-slate-500 tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-20 text-xs font-bold text-center animate-pulse text-slate-400"
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : currentTableData.length > 0 ? (
              currentTableData.map((emp) => (
                <tr
                  key={emp._id}
                  className="transition-colors hover:bg-slate-50/50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 text-xs font-black text-blue-600 bg-blue-100 rounded-full">
                        {emp.lastname ? emp.lastname[0] : "U"}
                      </div>
                      <span className="font-bold text-slate-700">
                        {emp.firstname} {emp.lastname}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {emp.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        emp.department
                          ? "bg-blue-50 text-blue-600"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {emp.department?.name || "Chưa xếp"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {emp.contactnumber || "---"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setModalType("detail");
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setModalType("confirm");
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-16 text-xs italic text-center text-slate-400"
                >
                  Không tìm thấy kết quả phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t bg-slate-50 border-slate-100">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 bg-white border rounded-lg text-slate-600 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 text-xs font-black rounded-lg ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white border text-slate-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 bg-white border rounded-lg text-slate-600 disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={modalType === "confirm"}
        onClose={() => setModalType(null)}
        onConfirm={handleConfirmDelete}
        status="Rejected"
        employeeName={`${selectedEmployee?.firstname} ${selectedEmployee?.lastname}`}
        isLoading={isSubmitting}
      />
      <EmployeeDetailModal
        isOpen={modalType === "detail"}
        onClose={() => setModalType(null)}
        employeeData={selectedEmployee}
      />
    </div>
  );
};

export default EmployeesPage;
