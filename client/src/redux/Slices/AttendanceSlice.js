import { createSlice } from "@reduxjs/toolkit";
import { HandleHRDeleteAttendance, HandleHRGetAllAttendance } from "../Thunks/AttendanceThunk";


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
    reducers: {
        
    },
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
            });
    }
});

export default AttendanceSlice.reducer;