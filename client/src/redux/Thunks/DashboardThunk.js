import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../apis/apiService.js";
import { DashboardEndPoints } from "../apis/APIsEndpoints.js";

export const HandleGetDashboard = createAsyncThunk("HandleGetDashboard", async (DashboardData, { rejectWithValue }) => {
    try {
        const { apiroute } = DashboardData
        const response = await apiService.get(`${DashboardEndPoints[apiroute]}`, { 
            withCredentials: true
        })
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data); 
    }
})

export const HandleGetLeaveReport = createAsyncThunk(
    "HandleGetLeaveReport",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiService.get(
                DashboardEndPoints.GET_LEAVE_REPORT,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const HandleGetAttendanceReport = createAsyncThunk(
    "HandleGetAttendanceReport",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiService.get(
                DashboardEndPoints.GET_ATTENDANCE_REPORT,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const HandleGetRecruitmentReport = createAsyncThunk(
    "HandleGetRecruitmentReport",
    async (year, { rejectWithValue }) => {
        try {
            const response = await apiService.get(
                `${DashboardEndPoints.GET_RECRUITMENT_REPORT}/${year}`,
                { withCredentials: true }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);