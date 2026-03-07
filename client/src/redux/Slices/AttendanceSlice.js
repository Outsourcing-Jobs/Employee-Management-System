import { createSlice } from "@reduxjs/toolkit";
import { HandleHRDeleteAttendance, HandleHRGetAllAttendance, HandleUpdateAttendance } from "../Thunks/AttendanceThunk";

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
            });
    }
});

export default AttendanceSlice.reducer;