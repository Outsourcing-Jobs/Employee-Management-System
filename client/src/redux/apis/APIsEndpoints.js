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
    GETDATA: "/api/v1/dashboard/HR-dashboard"
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