import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../apis/apiService";
import { LeavePageEndPoints } from "../apis/APIsEndpoints";

export const HandleGetAllLeaves = createAsyncThunk(
  "HandleGetAllLeaves",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`${LeavePageEndPoints.GETALL}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Lỗi khi lấy dữ liệu nghỉ phép"
      );
    }
  }
);

export const HandleHRUpdateLeave = createAsyncThunk(
  "HandleHRUpdateLeave",
  async (updateData, { rejectWithValue }) => {
    try {
      const response = await apiService.patch(
        `${LeavePageEndPoints.HR_UPDATE}`,
        updateData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Cập nhật thất bại");
    }
  }
);
