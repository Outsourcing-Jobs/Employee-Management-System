import { createSlice } from "@reduxjs/toolkit";

import { HRDashboardAsyncReducer } from "../AsyncReducers/asyncreducer";
import { HandleGetAllLeaves } from "../Thunks/LeaveThunk";

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
    }
});

export default HRLeavePageSlice.reducer;