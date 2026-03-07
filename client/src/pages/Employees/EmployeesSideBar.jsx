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
    SidebarProvider,
  } from "@/components/ui/sidebar";
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
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { HandleLogout } from "../../redux/Thunks/EmployeeThunk";
export const EmployeesSideBar = () =>{
const dispatch = useDispatch();

  const handleLogout = async (e) => {
    e.preventDefault();
  
    try {
      await dispatch(HandleLogout()).unwrap();
      Cookies.remove("EMtoken", { path: "/" }); 
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error(error);
    }
  };
    return(
        <SidebarProvider>
                <Sidebar>
                   <SidebarContent>
                     <SidebarGroup>
                       <div className="px-4 py-2 text-3xl font-extrabold tracking-tighter text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                         HR-ERP
                       </div>
                       <SidebarGroupContent>
                         <SidebarMenu className="gap-3 p-2">
                           <NavLink
                             to={"/Emp/dashboard/dashboard-data"}
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
                             to={"/Emp/dashboard/noti"}
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
                             to={"/Emp/dashboard/leave"}
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
                             to={"/Emp/dashboard/attendance"}
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
                             to={"/Emp/dashboard/internal-requests"}
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
                             to={"/Emp/dashboard/profile"}
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
                                 <button className="text-[16px]">Thông tin cá nhân </button>
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
        </SidebarProvider>
    )
}