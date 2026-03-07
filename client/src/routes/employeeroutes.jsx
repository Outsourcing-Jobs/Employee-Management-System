import { EmployeeLogin } from "../pages/Employees/emplyoeelogin.jsx"
import { EmployeeDashboard } from "../pages/Employees/employeedashboard.jsx"
import { ProtectedRoutes } from "./protectedroutes.jsx"
import { ForgotPassword } from "../pages/Employees/forgotpassword.jsx"
import { ResetEmailConfirm } from "../pages/Employees/resetemailconfirm.jsx"
import { ResetPassword } from "../pages/Employees/resetpassword.jsx"
import { EntryPage } from "../pages/Employees/EntryPage.jsx"
import ProfilePage from "../pages/Employees/Profiles/ProfilePage.jsx"
import EmployeeDashboardContent from "../pages/Employees/Dashboard/EmployeeDashboardContent.jsx"
import RequestPage from "../pages/Employees/Request/RequestPage.jsx"
import AttendancePage from "../pages/Employees/Attendance/AttendancePage.jsx"
import LeavePage from "../pages/Employees/Leave/LeavePage.jsx"
import NotiPage from "../pages/Employees/Noti/NotiPage.jsx"



export const EmployeeRoutes = [
    {
        path: "/",
        element: <EntryPage />
    },
    {
        path: "/auth/employee/login",
        element: <EmployeeLogin />
    },
    {
        path: "/auth/employee/forgot-password",
        element: <ForgotPassword />
    },
    {
        path: "/auth/employee/reset-email-confirmation",
        element: <ResetEmailConfirm />
    },
    {
        path: "/auth/employee/resetpassword/:token",
        element: <ResetPassword /> 
    },
    {
        path: "/Emp/dashboard",
        element: <ProtectedRoutes><EmployeeDashboard /></ProtectedRoutes>,
        children: [
            { index: true, element: <EmployeeDashboardContent /> }, 
            { path: "dashboard-data", element: <EmployeeDashboardContent /> }, 
            { path: "profile", element: <ProfilePage /> },
            { path: "internal-requests", element: <RequestPage /> },
            { path: "attendance", element: <AttendancePage /> },
            { path: "leave", element: <LeavePage /> },
            { path: "noti", element: <NotiPage/> }

        ]
    },
]