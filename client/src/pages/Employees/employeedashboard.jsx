import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { EmployeesSideBar } from "./EmployeesSideBar.jsx"

export const EmployeeDashboard = () => {
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        // Chỉ redirect khi đang ở đúng /Emp/dashboard (không có child path)
        if (location.pathname === "/Emp/dashboard" || location.pathname === "/Emp/dashboard/") {
            navigate("/Emp/dashboard/dashboard-data", { replace: true })
        }
    }, [location.pathname, navigate])

    return (
        <div className="flex HR-dashboard-container">
            <div className="HRDashboard-sidebar">
                <SidebarProvider>
                    <EmployeesSideBar />
                    <div className="sidebar-container min-[250px]:absolute md:relative">
                        <SidebarTrigger />
                    </div>
                </SidebarProvider>
            </div>
            <div className="HRdashboard-container h-screen w-full min-[250px]:mx-1 md:mx-2 flex flex-col">
                <Outlet />
            </div>
        </div>
    )
}