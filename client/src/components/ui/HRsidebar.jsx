import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

import { NavLink } from "react-router-dom"

export function HRdashboardSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    {/* <SidebarGroupLabel>HR-Dashboard EMS</SidebarGroupLabel> */}
                    <SidebarGroupContent>

                        <SidebarMenu className="gap-3 p-2">


                            <NavLink to={"/HR/dashboard/dashboard-data"} className={({ isActive }) => { return isActive ? "bg-blue-200 rounded-lg" : "" }}>

                                <SidebarMenuItem className="flex gap-4 rounded-lg hover:bg-blue-200">
                                    <img src="/../../src/assets/HR-Dashboard/dashboard.png" alt="" className="my-1 w-7 ms-2" />
                                    <button className="text-[16px]">Dashboard</button>
                                </SidebarMenuItem>

                            </NavLink>


                            <NavLink to={"/HR/dashboard/employees"} className={({ isActive }) => { return isActive ? "bg-blue-200 rounded-lg" : "" }}>

                                <SidebarMenuItem className="flex gap-4 rounded-lg hover:bg-blue-200">
                                    <img src="/../../src/assets/HR-Dashboard/employee-2.png" alt="" className="my-1 w-7 ms-2" />
                                    <button className="text-[16px]">Nhân viên</button>
                                </SidebarMenuItem>

                            </NavLink>



                            <NavLink to={"/HR/dashboard/departments"} className={({ isActive }) => { return isActive ? "bg-blue-200 rounded-lg" : "" }}>

                                <SidebarMenuItem className="flex gap-4 rounded-lg hover:bg-blue-200">

                                    <img src="/../../src/assets/HR-Dashboard/department.png" alt="" className="my-1 w-7 ms-2" />
                                    <button className="text-[16px]">Phòng ban</button>

                                </SidebarMenuItem>

                            </NavLink>

                            <SidebarMenuItem className="my-1">
                                <SidebarMenuButton className="gap-4">
                                    <img src="/../../src/assets/HR-Dashboard/salary.png" alt="" className="w-7" />
                                    <button className="text-[16px]">Lương bổng</button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem className="my-1">
                                <SidebarMenuButton className="gap-4">
                                    <img src="/../../src/assets/HR-Dashboard/notice.png" alt="" className="w-7" />
                                    <button className="text-[16px]">Thông báo</button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem className="my-1">
                                <SidebarMenuButton className="gap-4">
                                    <img src="/../../src/assets/HR-Dashboard/leave.png" alt="" className="w-7" />
                                    <button className="text-[16px]">Nghỉ phép</button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem className="my-1">
                                <SidebarMenuButton className="gap-4">
                                    <img src="/../../src/assets/HR-Dashboard/attendance.png" alt="" className="w-7" />
                                    <button className="text-[16px]">Chấm công</button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem className="my-1">
                                <SidebarMenuButton className="gap-4">
                                    <img src="/../../src/assets/HR-Dashboard/recruitment.png" alt="" className="w-7" />
                                    <button className="text-[16px]">Tuyển dụng</button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem className="my-1">
                                <SidebarMenuButton className="gap-4">
                                    <img src="/../../src/assets/HR-Dashboard/interview-insights.png" alt="" className="w-7" />
                                    <button className="text-[16px]">Thông tin phỏng vấn</button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem className="my-1">
                                <SidebarMenuButton className="gap-4">
                                    <img src="/../../src/assets/HR-Dashboard/request.png" alt="" className="w-7" />
                                    <button className="text-[16px]">Yêu cầu</button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem className="my-1">
                                <SidebarMenuButton className="gap-4">
                                    <img src="/../../src/assets/HR-Dashboard/HR-profiles.png" alt="" className="w-7" />
                                    <button className="text-[16px]">Hồ sơ nhân sự</button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                        </SidebarMenu>

                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )

}
