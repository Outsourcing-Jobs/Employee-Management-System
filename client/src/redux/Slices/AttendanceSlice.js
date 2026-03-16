import { createSlice } from "@reduxjs/toolkit";
import { HandleGetMyAttendance, HandleHRDeleteAttendance, HandleHRGetAllAttendance, HandleUpdateAttendance } from "../Thunks/AttendanceThunk";

const AttendanceSlice = createSlice({
    name: "HRAttendanceSlice",
    initialState: {
        isLoading: false,
        data: [], 
        success: false,
        error: {
            status: false,
            message: null
        },
        fetchData: true 
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(HandleHRGetAllAttendance.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(HandleHRGetAllAttendance.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.data;
                state.fetchData = false; 
            })
            .addCase(HandleHRGetAllAttendance.rejected, (state, action) => {
                state.isLoading = false;
                state.error.status = true;
                state.error.message = action.payload;
            })

            .addCase(HandleHRDeleteAttendance.fulfilled, (state) => {
                state.fetchData = true; 
            })

            // Update attendance (check-in/check-out)
            .addCase(HandleUpdateAttendance.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(HandleUpdateAttendance.fulfilled, (state) => {
                state.isLoading = false;
                state.fetchData = true;
            })
            .addCase(HandleUpdateAttendance.rejected, (state, action) => {
                state.isLoading = false;
                state.error.status = true;
                state.error.message = action.payload;
            })

            // GET MY ATTENDANCE (Employee)
            .addCase(HandleGetMyAttendance.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(HandleGetMyAttendance.fulfilled, (state, action) => {
                state.isLoading = false;
                // API trả về { data: [{ attendancelog: [...] }] }
                // Lấy phần tử đầu tiên trong mảng
                state.myAttendance = action.payload.data?.[0] || null;
                state.success = true;
            })
            .addCase(HandleGetMyAttendance.rejected, (state, action) => {
                state.isLoading = false;
                state.error.status = true;
                state.error.message = action.payload?.message || "Lỗi lấy lịch sử chấm công";
            });

    }
});

export default AttendanceSlice.reducer;