
import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../apis/apiService";
import { SalaryPageEndPoints } from "../apis/APIsEndpoints";

export const HandleGetAllSalaries = createAsyncThunk(
    "salary/getAll",
    async (params, { rejectWithValue }) => {
      try {
        const response = await apiService.get(SalaryPageEndPoints.GETALL, {
          params, 
          withCredentials: true,
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi lấy bảng lương");
      }
    }
  );

export const HandleCreateSalary = createAsyncThunk(
    "salary/create",
    async (salaryData, { rejectWithValue }) => {
        try {
            const response = await apiService.post(SalaryPageEndPoints.CREATE, salaryData, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);