import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../apis/apiService.js";
import { HRInterviewInsightsEndPoints } from "../apis/APIsEndpoints.js";

/* GET ALL */
export const HandleGetInterviewInsights = createAsyncThunk(
    "HandleGetInterviewInsights",
    async (data, { rejectWithValue }) => {
        try {
            const { apiroute } = data;
            const response = await apiService.get(
                `${HRInterviewInsightsEndPoints[apiroute]}`,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

/* POST */
export const HandlePostInterviewInsight = createAsyncThunk(
    "HandlePostInterviewInsight",
    async (payload, { rejectWithValue }) => {
        try {
            const { apiroute, data } = payload;
            const response = await apiService.post(
                `${HRInterviewInsightsEndPoints[apiroute]}`,
                data,
                { withCredentials: true }
            );
            return {
                data: response.data,
                type: "InterviewInsightCreate",
                success: true
            };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

/* DELETE */
export const HandleDeleteInterviewInsight = createAsyncThunk(
    "HandleDeleteInterviewInsight",
    async (payload, { rejectWithValue }) => {
        try {
            const { apiroute } = payload; // VD: "DELETE.ID"
            const RouteArray = apiroute.split(".");
            const response = await apiService.delete(
                `${HRInterviewInsightsEndPoints[RouteArray[0]](RouteArray[1])}`,
                { withCredentials: true }
            );
            return {
                data: response.data,
                type: "InterviewInsightDelete",
                success: true
            };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

/* GET ONE BY ID */
export const HandleGetInterviewInsightByID = createAsyncThunk(
    "HandleGetInterviewInsightByID",
    async (payload, { rejectWithValue }) => {
        try {
            const { interviewID } = payload;
            const response = await apiService.get(
                `${HRInterviewInsightsEndPoints.GETONE(interviewID)}`,
                { withCredentials: true }
            );
            return {
                data: response.data,
                type: "GetInterviewInsight",
                success: true
            };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

/* PATCH */
export const HandlePatchInterviewInsight = createAsyncThunk(
    "HandlePatchInterviewInsight",
    async (payload, { rejectWithValue }) => {
        try {
            const { apiroute, data } = payload;
            const response = await apiService.patch(
                `${HRInterviewInsightsEndPoints[apiroute]}`,
                data,
                { withCredentials: true }
            );
            return {
                data: response.data,
                type: "InterviewInsightUpdate",
                success: true
            };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
