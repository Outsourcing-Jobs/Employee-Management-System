import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../apis/apiService";
import { NoticeEndPoints } from "../apis/APIsEndpoints";


export const HandleGetAllNotices = createAsyncThunk(
    "notice/getAll",
    async (params, { rejectWithValue }) => {
        try {
            const response = await apiService.get(NoticeEndPoints.GETALL, { 
                params,
                withCredentials: true 
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi lấy danh sách thông báo");
        }
    }
);

export const HandleCreateNotice = createAsyncThunk(
    "notice/create",
    async (noticeData, { rejectWithValue }) => {
        try {
            const response = await apiService.post(NoticeEndPoints.CREATE, noticeData, { 
                withCredentials: true 
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Tạo thông báo thất bại");
        }
    }
);


export const HandleUpdateNotice = createAsyncThunk(
    "notice/update",
    async ({ noticeID, UpdatedData }, { rejectWithValue }) => {
        try {
            const response = await apiService.patch(NoticeEndPoints.UPDATE, 
                { noticeID, UpdatedData }, 
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Cập nhật thông báo thất bại");
        }
    }
);


export const HandleDeleteNotice = createAsyncThunk(
    "notice/delete",
    async (noticeID, { rejectWithValue }) => {
        try {
            const response = await apiService.delete(NoticeEndPoints.DELETE(noticeID), { 
                withCredentials: true 
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Xóa thông báo thất bại");
        }
    }
);

export const HandleGetOneNotice = createAsyncThunk(
    "notice/getOne",
    async (noticeID, { rejectWithValue }) => {
        try {
            const response = await apiService.get(NoticeEndPoints.GETONE(noticeID), { 
                withCredentials: true 
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi lấy chi tiết thông báo");
        }
    }
);