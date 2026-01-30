import { configureStore } from '@reduxjs/toolkit'
import EmployeeReducer from "../Slices/EmployeeSlice.js"
import HRReducer from '../Slices/HRSlice.js'
import DashbaordReducer from "../Slices/DashboardSlice.js"
import HREmployeesPageReducer from '../Slices/HREmployeesPageSlice.js'
import HRDepartmentPageReducer from '../Slices/HRDepartmentPageSlice.js'
import EMployeesIDReducer from '../Slices/EmployeesIDsSlice.js'
import HRRecruitmentPageReducer from '../Slices/HRRecruitmentPageSlice.js'
import InterviewInsightsReducer from '../Slices/InterviewInsightsSlice.js'
import GenerateRequestReducer from '../Slices/GenerateRequestSlice.js'
import HRManagementReducer from '../Slices/HRProfileSlice.js'

export const store = configureStore({
    reducer: {
        employeereducer: EmployeeReducer,
        HRReducer: HRReducer,
        dashboardreducer: DashbaordReducer,
        HREmployeesPageReducer : HREmployeesPageReducer,
        HRDepartmentPageReducer : HRDepartmentPageReducer,
        EMployeesIDReducer : EMployeesIDReducer,
        HRRecruitmentPageReducer : HRRecruitmentPageReducer,
        InterviewInsightsReducer : InterviewInsightsReducer,
        GenerateRequestReducer : GenerateRequestReducer,
        HRManagementReducer : HRManagementReducer
    }
})