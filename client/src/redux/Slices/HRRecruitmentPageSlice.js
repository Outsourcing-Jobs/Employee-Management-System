import { createSlice } from "@reduxjs/toolkit";
import { HRRecruitmentPageAsyncReducer } from "../AsyncReducers/asyncreducer.js";
import { HandleGetRecruitments, HandlePostRecruitment, HandleDeleteRecruitment,HandlePatchRecruitment, HandleGetRecruitmentByID } from "../Thunks/HRRecruitmentPageThunk.js";

const RecruitmentPageSlice = createSlice({
    name: "RecruitmentPage",
    initialState: {
        data: null, 
        isLoading: false,
        selectedRecruitment: null,
        success: false,
        fetchData: false, 
        error: {
            status: false,
            message: null,
            content: null
        }
    },
    extraReducers: (builder) => {
        HRRecruitmentPageAsyncReducer(builder, HandleGetRecruitments);
        HRRecruitmentPageAsyncReducer(builder, HandlePostRecruitment);
        HRRecruitmentPageAsyncReducer(builder, HandleDeleteRecruitment);
        HRRecruitmentPageAsyncReducer(builder, HandlePatchRecruitment);
        HRRecruitmentPageAsyncReducer(builder, HandleGetRecruitmentByID);
    }
});

export default RecruitmentPageSlice.reducer;