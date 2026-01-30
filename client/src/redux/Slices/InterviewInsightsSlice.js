import { createSlice } from "@reduxjs/toolkit";
import { HRInterviewInsightsAsyncReducer } from "../AsyncReducers/asyncreducer.js";
import {
    HandleGetInterviewInsights,
    HandlePostInterviewInsight,
    HandleDeleteInterviewInsight,
    HandlePatchInterviewInsight,
    HandleGetInterviewInsightByID
} from "../Thunks/InterviewInsightsThunk.js";

const InterviewInsightsSlice = createSlice({
    name: "InterviewInsights",
    initialState: {
        data: null,
        selectedInterview: null,
        isLoading: false,
        success: false,
        fetchData: false,
        error: {
            status: false,
            message: null,
            content: null
        }
    },
    extraReducers: (builder) => {
        HRInterviewInsightsAsyncReducer(builder, HandleGetInterviewInsights);
        HRInterviewInsightsAsyncReducer(builder, HandlePostInterviewInsight);
        HRInterviewInsightsAsyncReducer(builder, HandleDeleteInterviewInsight);
        HRInterviewInsightsAsyncReducer(builder, HandlePatchInterviewInsight);
        HRInterviewInsightsAsyncReducer(builder, HandleGetInterviewInsightByID);
    }
});

export default InterviewInsightsSlice.reducer;
