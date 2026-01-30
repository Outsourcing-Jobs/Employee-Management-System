import { HRSignupPage } from "../pages/HumanResources/HRSignup"
import { HRLogin } from "../pages/HumanResources/HRlogin"
import { HRDashbaord } from "../pages/HumanResources/HRdashbaord"
import { VerifyEmailPage } from "../pages/HumanResources/verifyemailpage.jsx"
// import { ResetEmailConfirm } from "../pages/Employees/resetemailconfirm.jsx"
// import { ResetEmailVerification } from "../pages/HumanResources/resendemailverificaiton.jsx"
import { HRForgotPasswordPage } from "../pages/HumanResources/forgotpassword.jsx"
import { ResetMailConfirmPage } from "../pages/HumanResources/resetmailconfirm.jsx"
import { ResetHRPasswordPage } from "../pages/HumanResources/resetpassword.jsx"
import { ResetHRVerifyEmailPage } from "../pages/HumanResources/resetemail.jsx"
import { HRDashboardPage } from "../pages/HumanResources/Dashboard Childs/dashboardpage.jsx"
import { HRProtectedRoutes } from "./HRprotectedroutes.jsx"
import { HREmployeesPage } from "../pages/HumanResources/Dashboard Childs/employeespage.jsx"
import { HRDepartmentPage } from "../pages/HumanResources/Dashboard Childs/departmentpage.jsx"
import { RecruitmentPage } from "../pages/HumanResources/Recruitment/RecruitmentPage.jsx"
import { InterviewInsightsPage } from "../pages/HumanResources/InterviewInsights/InterviewInsightsPage.jsx"
import HRInternalRequestsPage from "../pages/HumanResources/InternalRequests/HRInternalRequestsPage.jsx"
import { HRManagementPage } from "../pages/HumanResources/HR/HRManagementPage.jsx"

export const HRRoutes = [
    // Nhóm Auth: gom hết vào một cụm
    {
        path: "/auth/HR",
        children: [
            { path: "signup", element: <HRSignupPage /> },
            { path: "login", element: <HRLogin /> },
            { path: "verify-email", element: <VerifyEmailPage /> },
            { path: "forgot-password", element: <HRForgotPasswordPage /> },
            { path: "reset-email-validation", element: <ResetHRVerifyEmailPage /> },
            { path: "reset-email-confirmation", element: <ResetMailConfirmPage /> },
            { path: "resetpassword/:token", element: <ResetHRPasswordPage /> },
        ]
    },
    // Nhóm Dashboard: quản lý tập trung
    {
        path: "/HR/dashboard",
        element: <HRDashbaord />, // Lưu ý: Bạn đang viết sai chính tả 'Dashbaord' nhé!
        children: [
            { index: true, element: <HRDashboardPage /> }, // Dùng index cho trang mặc định
            { path: "dashboard-data", element: <HRDashboardPage /> }, // Dùng index cho trang mặc định
            { path: "employees", element: <HREmployeesPage /> },
            { path: "departments", element: <HRDepartmentPage /> },
            { path: "recruitments", element: <RecruitmentPage /> },
            { path: "interview-insights", element: <InterviewInsightsPage /> },
            { path: "internal-requests", element: <HRInternalRequestsPage /> },
            { path: "hr-management", element: <HRManagementPage /> },
        ]
    },
]