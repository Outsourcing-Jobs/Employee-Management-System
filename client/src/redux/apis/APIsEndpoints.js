export const APIsEndPoints = {
    LOGIN: "/api/auth/employee/login",
    CHECKELOGIN: "/api/auth/employee/check-login",
    FORGOT_PASSWORD: "/api/auth/employee/forgot-password",
    RESET_PASSWORD: (token) => `/api/auth/employee/reset-password/${token}`
}

export const HREndPoints = {
    SIGNUP: "/api/auth/HR/signup",
    CHECKLOGIN: "/api/auth/HR/check-login",
    LOGIN: "/api/auth/HR/login",
    VERIFY_EMAIL: "/api/auth/HR/verify-email",
    CHECK_VERIFY_EMAIL: "/api/auth/HR/check-verify-email",
    RESEND_VERIFY_EMAIL: "/api/auth/HR/resend-verify-email",
    FORGOT_PASSWORD: "/api/auth/HR/forgot-password",
    RESET_PASSWORD: (token) => `/api/auth/HR/reset-password/${token}` 
}

export const DashboardEndPoints = {
    GETDATA: "/api/v1/dashboard/HR-dashboard",
    GET_LEAVE_REPORT: "/api/v1/dashboard/HR-dashboard-report-leave",
    GET_ATTENDANCE_REPORT: "/api/v1/dashboard/HR-dashboard-report-attendance" ,
    GET_RECRUITMENT_REPORT: "/api/v1/dashboard/HR-dashboard-report-recruitment"
}

export const HREmployeesPageEndPoints = {
    GETALL: "/api/v1/employee/all",
    ADDEMPLOYEE: "/api/auth/employee/signup",
    GETONE: (EMID) => `/api/v1/employee/by-HR/${EMID}`,
    DELETE: (EMID) => `/api/v1/employee/delete-employee/${EMID}`
}

export const HRDepartmentPageEndPoints = {
    GETALL: "/api/v1/department/all",
    CREATE: "/api/v1/department/create-department",
    UPDATE: "/api/v1/department/update-department",
    DELETE: "/api/v1/department/delete-department"
}

export const HRRecruitmentPageEndPoints = {
    GETALL: "/api/v1/recruitment/all",
    ADD: "/api/v1/recruitment/create-recruitment",
    UPDATE: "/api/v1/recruitment/update-recruitment",
    GETONE: (id) => `/api/v1/recruitment/${id}`,
    DELETE: (id) => `/api/v1/recruitment/delete-recruitment/${id}`,
}

export const HRInterviewInsightsEndPoints = {
    GETALL: "/api/v1/interview-insights/all",
    ADD: "/api/v1/interview-insights/create-interview",
    UPDATE: "/api/v1/interview-insights/update-interview",
    GETONE: (interviewID) => `/api/v1/interview-insights/${interviewID}`,
    DELETE: (interviewID) => `/api/v1/interview-insights/delete-interview/${interviewID}`,
};

export const GenerateRequestEndPoints = {
  GETALL: "/api/v1/generate-request/all",
  ADD: "/api/v1/generate-request/create-request",
  GETONE: (id) => `/api/v1/generate-request/${id}`,
  UPDATE_CONTENT: "/api/v1/generate-request/update-request-content",
  UPDATE_STATUS: "/api/v1/generate-request/update-request-status",
  DELETE: (id) => `/api/v1/generate-request/delete-request/${id}`,
};

export const EmployeesIDsEndPoints = {
    GETALL: "/api/v1/employee/all-employees-ids",
} 

export const HRProfileEndPoints = {
    GETALL: "/api/v1/hr/all",
    UPDATE: "/api/v1/hr/update-HR",
    GETONE: (HRID) => `/api/v1/hr/${HRID}`,
    DELETE: (HRID) => `/api/v1/hr/delete-HR/${HRID}`,
};
export const LeavePageEndPoints = {
    GETALL: "/api/v1/leave/all",
    CREATE: "/api/v1/leave/create-leave",
    GETONE: (leaveID) => `/api/v1/leave/${leaveID}`,
    HR_UPDATE: "/api/v1/leave/HR-update-leave",
    DELETE: (leaveID) => `/api/v1/leave/delete-leave/${leaveID}`,
};
export const SalaryPageEndPoints = {
    GETALL: "/api/v1/salary/all",
    CREATE: "/api/v1/salary/create-salary",
    UPDATE: "/api/v1/salary/update-salary",
    GETONE: (salaryID) => `/api/v1/salary/${salaryID}`,
    DELETE: (salaryID) => `/api/v1/salary/delete-salary/${salaryID}`,
};
export const AttendanceEndPoints = {
    GET_ALL: "/api/v1/attendance/all", 
    GET_DETAILS: (id) => `/api/v1/attendance/${id}`, 
    DELETE: (id) => `/api/v1/attendance/delete-attendance/${id}`,
};

export const NoticeEndPoints = {
    CREATE: "/api/v1/notice/create-notice",
    GETALL: "/api/v1/notice/all",
    GETONE: (noticeID) => `/api/v1/notice/${noticeID}`,
    UPDATE: "/api/v1/notice/update-notice",
    DELETE: (noticeID) => `/api/v1/notice/delete-notice/${noticeID}`,
};