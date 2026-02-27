import { createSlice } from "@reduxjs/toolkit";
import { HRDashboardAsyncReducer } from "../AsyncReducers/asyncreducer.js";
import { HandleGetAttendanceReport, HandleGetDashboard, HandleGetRecruitmentReport } from "../Thunks/DashboardThunk.js";
import { HandleGetLeaveReport } from "../Thunks/DashboardThunk.js";

const HRDashboardSlice = createSlice({
    name: "HRDashboard",
    initialState: {
        data: null,
        report: null,   
        isLoading: false,
        success : false, 
        error: {
            status: false,
            message: null,
            content: null,
        }
    },
    extraReducers: (builder) => {
        HRDashboardAsyncReducer(builder, HandleGetDashboard);

        builder
        .addCase(HandleGetLeaveReport.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(HandleGetLeaveReport.fulfilled, (state, action) => {
            state.isLoading = false;
            state.report = action.payload.data; // 👈 lấy data report
        })
        .addCase(HandleGetLeaveReport.rejected, (state, action) => {
            state.isLoading = false;
            state.error = {
                status: true,
                message: action.payload?.message,
                content: action.payload
            };
        });

        builder
        .addCase(HandleGetAttendanceReport.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(HandleGetAttendanceReport.fulfilled, (state, action) => {
            state.isLoading = false;
            state.attendanceReport = action.payload.data;
        })
        .addCase(HandleGetAttendanceReport.rejected, (state, action) => {
            state.isLoading = false;
            state.error = {
                status: true,
                message: action.payload?.message,
                content: action.payload
            };
        });

        builder
        .addCase(HandleGetRecruitmentReport.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(HandleGetRecruitmentReport.fulfilled, (state, action) => {
            state.isLoading = false;
            state.recruitmentReport = action.payload.data;
        })
        .addCase(HandleGetRecruitmentReport.rejected, (state, action) => {
            state.isLoading = false;
            state.error = {
                status: true,
                message: action.payload?.message,
                content: action.payload
            };
        });
    },
})

export default HRDashboardSlice.reducer