import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../apis/apiService";
import { HRRecruitmentPageEndPoints } from "../apis/APIsEndpoints";

/* GET ALL */
export const HandleGetRecruitments = createAsyncThunk("HandleGetRecruitments", async (data, { rejectWithValue }) => {
    try {
        const { apiroute } = data;
        const response = await apiService.get(`${HRRecruitmentPageEndPoints[apiroute]}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

/* POST */
export const HandlePostRecruitment = createAsyncThunk("HandlePostRecruitment", async (payload, { rejectWithValue }) => {
    try {
        const { apiroute, data } = payload;
        const response = await apiService.post(`${HRRecruitmentPageEndPoints[apiroute]}`, data, { withCredentials: true });
        return {
            data: response.data,
            type: "RecruitmentCreate",
            success: true
        };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

/* DELETE */
export const HandleDeleteRecruitment = createAsyncThunk("HandleDeleteRecruitment", async (payload, { rejectWithValue }) => {
    try {
        const { apiroute } = payload; // VD: "DELETE.ID_CUA_BAN"
        const RouteArray = apiroute.split(".");
        const response = await apiService.delete(`${HRRecruitmentPageEndPoints[RouteArray[0]](RouteArray[1])}`, { withCredentials: true });
        return {
            data: response.data,
            type: "RecruitmentDelete",
            success: true
        };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
}); 

/* GET ONE BY ID */
export const HandleGetRecruitmentByID = createAsyncThunk("HandleGetRecruitmentByID", async (payload, { rejectWithValue }) => {
    try {
        const { recruitmentID } = payload;
        const response = await apiService.get(`${HRRecruitmentPageEndPoints.GETONE(recruitmentID)}`, { withCredentials: true });
        return {
            fetchData: response.data,
            type: "GetRecruitment",
            success: true
        };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

/* PATCH (UPDATE) */
export const HandlePatchRecruitment = createAsyncThunk("HandlePatchRecruitment", async (payload, { rejectWithValue }) => {
    try {
        const { apiroute, data } = payload;
        const response = await apiService.patch(`${HRRecruitmentPageEndPoints[apiroute]}`, data, { withCredentials: true });
        return {
            data: response.data,
            type: "RecruitmentUpdate", // Đặt type để reducer bắt được
            success: true
        };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});