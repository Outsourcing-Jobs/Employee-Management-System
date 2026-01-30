import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../apis/apiService";
import { HRProfileEndPoints } from "../apis/APIsEndpoints";

/* GET ALL */
export const HandleGetHRs = createAsyncThunk(
    "HandleGetHRs",
    async (data, { rejectWithValue }) => {
        try {
            const { apiroute } = data;
            const response = await apiService.get(
                `${HRProfileEndPoints[apiroute]}`,
                { withCredentials: true }
            );
            return response.data; // Giả định trả về { success, data: [...] }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

/* DELETE */
export const HandleDeleteHR = createAsyncThunk(
    "HandleDeleteHR",
    async (payload, { rejectWithValue }) => {
        try {
            const { apiroute } = payload;
            const RouteArray = apiroute.split(".");
            const response = await apiService.delete(
                `${HRProfileEndPoints[RouteArray[0]](RouteArray[1])}`,
                { withCredentials: true }
            );
            return {
                data: response.data,
                type: "HRDelete",
                success: true
            };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

/* UPDATE */
export const HandlePatchHR = createAsyncThunk(
    "HandlePatchHR",
    async (payload, { rejectWithValue }) => {
        try {
            const { apiroute, data } = payload;
            const response = await apiService.patch(
                `${HRProfileEndPoints[apiroute]}`,
                data,
                { withCredentials: true }
            );
            return {
                data: response.data,
                type: "HRUpdate",
                success: true
            };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

/* GET BY ID */
export const HandleGetHRByID = createAsyncThunk(
    "HandleGetHRByID",
    async (payload, { rejectWithValue }) => {
        try {
            const { hrID } = payload;
            const response = await apiService.get(
                `${HRProfileEndPoints.GETONE(hrID)}`,
                { withCredentials: true }
            );
            return {
                data: response.data,
                type: "GetHRDetail",
                success: true
            };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);