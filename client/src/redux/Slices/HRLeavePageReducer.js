import { createSlice } from "@reduxjs/toolkit";

import { HRDashboardAsyncReducer } from "../AsyncReducers/asyncreducer";
import { HandleCreateLeave, HandleDeleteLeave, HandleGetAllLeaves, HandleGetMyLeaves } from "../Thunks/LeaveThunk";

const HRLeavePageSlice = createSlice({
    name: "HRLeavePageSlice",
    initialState: {
        isLoading: false,
        data: [], 
        success: false,
        error: {
            status: false,
            message: null,
            content: null
        },
        fetchData: true 
    },
    reducers: {
    
    },
    extraReducers: (builder) => {

        HRDashboardAsyncReducer(builder, HandleGetAllLeaves);
        builder
        .addCase(HandleCreateLeave.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(HandleCreateLeave.fulfilled, (state) => {
            state.isLoading = false;
            state.fetchData = true;
        })
        .addCase(HandleCreateLeave.rejected, (state, action) => {
            state.isLoading = false;
            state.error.status = true;
            state.error.message = action.payload;
        })

    // Delete leave
        .addCase(HandleDeleteLeave.fulfilled, (state) => {
            state.fetchData = true;
        })
        .addCase(HandleGetMyLeaves.pending, (state) => {
            state.isLoading = true;
            state.error = { status: false, message: null, content: null };
          })
          .addCase(HandleGetMyLeaves.fulfilled, (state, action) => {
            state.isLoading = false;
            state.myLeaves = action.payload.data || [];
            state.success = true;
            state.fetchData = false;
          })
          .addCase(HandleGetMyLeaves.rejected, (state, action) => {
            state.isLoading = false;
            state.error = {
              status: true,
              message: action.payload?.message || "Lỗi lấy dữ liệu nghỉ phép",
              content: action.payload,
            };
          });
}
});
export default HRLeavePageSlice.reducer;