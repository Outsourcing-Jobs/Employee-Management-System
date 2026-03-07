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

export const HandleCreateLeave = createAsyncThunk(
  "HandleCreateLeave",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiService.post(
        LeavePageEndPoints.CREATE,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Tạo đơn nghỉ phép thất bại" }
      );
    }
  }
);

export const HandleDeleteLeave = createAsyncThunk(
  "HandleDeleteLeave",
  async (leaveID, { rejectWithValue }) => {
    try {
      const response = await apiService.delete(
        LeavePageEndPoints.DELETE(leaveID),
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Xóa đơn nghỉ phép thất bại" }
      );
    }
  }
);

export const HandleGetLeaveByID = createAsyncThunk(
  "HandleGetLeaveByID",
  async (leaveID, { rejectWithValue }) => {
    try {
      const response = await apiService.get(
        LeavePageEndPoints.GETONE(leaveID),
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Không thể tải chi tiết đơn nghỉ phép" }
      );
    }
  }
);