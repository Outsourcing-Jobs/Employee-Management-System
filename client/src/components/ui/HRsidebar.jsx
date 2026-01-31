import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import attendance from "../../assets/HR-Dashboard/attendance.png";
import dashboard from "../../assets/HR-Dashboard/dashboard.png";
import department from "../../assets/HR-Dashboard/department.png";
import employee2 from "../../assets/HR-Dashboard/employee-2.png";
import HRprofiles from "../../assets/HR-Dashboard/HR-profiles.png";
import interviewInsights from "../../assets/HR-Dashboard/interview-insights.png";
import leave from "../../assets/HR-Dashboard/leave.png";
import logout from "../../assets/HR-Dashboard/logout.png";
import recruitment from "../../assets/HR-Dashboard/recruitment.png";
import request from "../../assets/HR-Dashboard/request.png";
import salary from "../../assets/HR-Dashboard/Salary.png";
import notice from "../../assets/HR-Dashboard/notice.png";

export function HRdashboardSidebar() {
  const handleLogout = (e) => {
    e.preventDefault(); 
    Cookies.remove("HRtoken", { path: "/" }); 
    window.location.href = "/"; 
  };
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="px-4 py-2 text-3xl font-extrabold tracking-tighter text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
            HR-ERP
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="gap-3 p-2">
              <NavLink
                to={"/HR/dashboard/dashboard-data"}
                className={({ isActive }) => {
                  return isActive ? "bg-blue-200 rounded-lg" : "";
                }}
              >
                <SidebarMenuItem className="flex gap-4 rounded-lg hover:bg-blue-200">
                  <img
                    src={dashboard}
                    alt=""
                    className="my-1 w-7 ms-2"
                  />
                  <button className="text-[16px]">Dashboard</button>
                </SidebarMenuItem>
              </NavLink>

              <NavLink
                to={"/HR/dashboard/employees"}
                className={({ isActive }) => {
                  return isActive ? "bg-blue-200 rounded-lg" : "";
                }}
              >
                <SidebarMenuItem className="flex gap-4 rounded-lg hover:bg-blue-200">
                  <img
                    src={employee2}
                    alt=""
                    className="my-1 w-7 ms-2"
                  />
                  <button className="text-[16px]">Nhân viên</button>
                </SidebarMenuItem>
              </NavLink>

              <NavLink
                to={"/HR/dashboard/departments"}
                className={({ isActive }) => {
                  return isActive ? "bg-blue-200 rounded-lg" : "";
                }}
              >
                <SidebarMenuItem className="flex gap-4 rounded-lg hover:bg-blue-200">
                  <img
                    src={department}
                    alt=""
                    className="my-1 w-7 ms-2"
                  />
                  <button className="text-[16px]">Phòng ban</button>
                </SidebarMenuItem>
              </NavLink>
              <NavLink
                to={"/HR/dashboard/salary"}
                className={({ isActive }) => {
                  return isActive ? "bg-blue-200 rounded-lg" : "";
                }}
              >
              <SidebarMenuItem className="my-1">
                <SidebarMenuButton className="gap-4">
                  <img
                    src={salary}
                    alt=""
                    className="w-7"
                  />
                  <button className="text-[16px]">Lương bổng</button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              </NavLink>
              <NavLink
                to={"/HR/dashboard/notice"}
                className={({ isActive }) => {
                  return isActive ? "bg-blue-200 rounded-lg" : "";
                }}
              >
              <SidebarMenuItem className="my-1">
                <SidebarMenuButton className="gap-4">
                  <img
                    src={notice}
                    alt=""
                    className="w-7"
                  />
                  <button className="text-[16px]">Thông báo</button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              </NavLink>
              <NavLink
                to={"/HR/dashboard/leave"}
                className={({ isActive }) => {
                  return isActive ? "bg-blue-200 rounded-lg" : "";
                }}
              >
              <SidebarMenuItem className="my-1">
                <SidebarMenuButton className="gap-4">
                  <img
                    src={leave}
                    alt=""
                    className="w-7"
                  />
                  <button className="text-[16px]">Nghỉ phép</button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              </NavLink>
              <NavLink
                to={"/HR/dashboard/attendance"}
                className={({ isActive }) => {
                  return isActive ? "bg-blue-200 rounded-lg" : "";
                }}
              >
              <SidebarMenuItem className="my-1">
                <SidebarMenuButton className="gap-4">
                  <img
                    src={attendance}
                    alt=""
                    className="w-7"
                  />
                  <button className="text-[16px]">Chấm công</button>
                </SidebarMenuButton>
              </SidebarMenuItem>
             </NavLink>
              <NavLink
                to={"/HR/dashboard/recruitments"}
                className={({ isActive }) => {
                  return isActive ? "bg-blue-200 rounded-lg" : "";
                }}
              > 
                <SidebarMenuItem className="my-1">
                  <SidebarMenuButton className="gap-4">
                    <img
                      src={recruitment}
                      alt=""
                      className="w-7"
                    />
                    <button className="text-[16px]">Tuyển dụng</button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </NavLink>

              <NavLink
                to={"/HR/dashboard/interview-insights"}
                className={({ isActive }) => {
                  return isActive ? "bg-blue-200 rounded-lg" : "";
                }}
              >
                <SidebarMenuItem className="my-1">
                  <SidebarMenuButton className="gap-4">
                    <img
                      src={interviewInsights}
                      alt=""
                      className="w-7"
                    />
                    <button className="text-[16px]">Thông tin phỏng vấn</button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </NavLink>
              <NavLink
                to={"/HR/dashboard/internal-requests"}
                className={({ isActive }) => {
                  return isActive ? "bg-blue-200 rounded-lg" : "";
                }}
              >
                <SidebarMenuItem className="my-1">
                  <SidebarMenuButton className="gap-4">
                    <img
                      src={request}
                      alt=""
                      className="w-7"
                    />
                    <button className="text-[16px]">Yêu cầu</button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </NavLink>

              <NavLink
                to={"/HR/dashboard/hr-management"}
                className={({ isActive }) => {
                  return isActive ? "bg-blue-200 rounded-lg" : "";
                }}
              > 
                <SidebarMenuItem className="my-1">
                  <SidebarMenuButton className="gap-4">
                    <img
                      src={HRprofiles}
                      alt=""
                      className="w-7"
                    />
                    <button className="text-[16px]">Hồ sơ quản trị</button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </NavLink>

              <NavLink
                to={"/"}
                className={({ isActive }) => {
                  return isActive ? "bg-blue-200 rounded-lg" : "";
                }}
              >              
                <SidebarMenuItem onClick={handleLogout} className="my-1">
                    <SidebarMenuButton className="gap-4">
                      <img
                        src={logout}
                        alt=""
                        className="w-7"
                      />
                      <button className="text-[16px]">Đăng xuất</button>
                    </SidebarMenuButton>
                </SidebarMenuItem>  
              </NavLink>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
