import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../apis/apiService";
import { AttendanceEndPoints } from "../apis/APIsEndpoints";


export const HandleHRGetAllAttendance = createAsyncThunk(
    "hrAttendance/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiService.get(AttendanceEndPoints.GET_ALL, { 
                withCredentials: true 
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi lấy dữ liệu điểm danh");
        }
    }
);

export const HandleHRDeleteAttendance = createAsyncThunk(
    "hrAttendance/delete",
    async (attendanceID, { rejectWithValue }) => {
        try {
            const response = await apiService.delete(AttendanceEndPoints.DELETE(attendanceID), { 
                withCredentials: true 
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Xóa bản ghi thất bại");
        }
    }
);