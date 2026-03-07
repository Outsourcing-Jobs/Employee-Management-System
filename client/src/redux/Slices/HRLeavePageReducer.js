import { createSlice } from "@reduxjs/toolkit";

import { HRDashboardAsyncReducer } from "../AsyncReducers/asyncreducer";
import { HandleCreateLeave, HandleDeleteLeave, HandleGetAllLeaves } from "../Thunks/LeaveThunk";

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
        });
}
});
export default HRLeavePageSlice.reducer;