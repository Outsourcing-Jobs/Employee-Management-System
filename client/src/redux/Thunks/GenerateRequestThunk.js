import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../apis/apiService";
import { GenerateRequestEndPoints } from "../apis/APIsEndpoints";

/* GET ALL (HR-Admin) */
export const HandleGetRequests = createAsyncThunk(
  "HandleGetRequests",
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiService.get(
        GenerateRequestEndPoints.GETALL,
        {
          params,
          withCredentials: true,
        }
      );
      console.log("Fetched Requests:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

/* CREATE (Employee) */
export const HandleCreateRequest = createAsyncThunk(
  "HandleCreateRequest",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiService.post(
        GenerateRequestEndPoints.ADD,
        data,
        { withCredentials: true }
      );
      return {
        data: response.data,
        type: "RequestCreate",
        success: true,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

/* GET ONE BY ID */
export const HandleGetRequestByID = createAsyncThunk(
  "HandleGetRequestByID",
  async (requestID, { rejectWithValue }) => {
    try {
      const response = await apiService.get(
        GenerateRequestEndPoints.GETONE(requestID),
        { withCredentials: true }
      );
      return {
        data: response.data,
        type: "GetRequest",
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

/* UPDATE CONTENT (Employee) */
export const HandleUpdateRequestContent = createAsyncThunk(
  "HandleUpdateRequestContent",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiService.patch(
        GenerateRequestEndPoints.UPDATE_CONTENT,
        data,
        { withCredentials: true }
      );
      return {
        data: response.data,
        type: "RequestUpdate",
        success: true,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

/* UPDATE STATUS (HR-Admin) */
export const HandleUpdateRequestStatus = createAsyncThunk(
  "HandleUpdateRequestStatus",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiService.patch(
        GenerateRequestEndPoints.UPDATE_STATUS,
        data,
        { withCredentials: true }
      );
      return {
        data: response.data,
        type: "RequestUpdateStatus",
        success: true,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

/* DELETE (HR-Admin) */
export const HandleDeleteRequest = createAsyncThunk(
  "HandleDeleteRequest",
  async (requestID, { rejectWithValue }) => {
    try {
      const response = await apiService.delete(
        GenerateRequestEndPoints.DELETE(requestID),
        { withCredentials: true }
      );
      return {
        data: response.data,
        type: "RequestDelete",
        success: true,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
