import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../apis/apiService.js";
import { EmployeeSelfEndPoints, HREmployeesPageEndPoints } from "../apis/APIsEndpoints.js";

export const HandleGetHREmployees = createAsyncThunk('HandleGetHREmployees', async (HREmployeeData, { rejectWithValue }) => {
    try {
        const { apiroute } = HREmployeeData
        const response = await apiService.get(`${HREmployeesPageEndPoints[apiroute]}`, {
            withCredentials: true
        })
        return response.data
    }

    catch (error) {
        return rejectWithValue(error.response.data);
    }
}) 

export const HandlePostHREmployees = createAsyncThunk('HandlePostHREmploy', async (HREmployeeData, { rejectWithValue }) => {
    try {
        const { apiroute, data } = HREmployeeData
        const response = await apiService.post(`${HREmployeesPageEndPoints[apiroute]}`, data, {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

export const HandleDeleteHREmployees = createAsyncThunk("HandleDeleteHREmployees", async (HREmployeeData, { rejectWithValue }) => {
    try {
        const { apiroute } = HREmployeeData
        const RouteArray = apiroute.split(".")
        if (RouteArray.length > 0) {
            const response = await apiService.delete(`${HREmployeesPageEndPoints[RouteArray[0]](RouteArray[1])}`, {
                withCredentials : true
            })
            return response.data
        }
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})
export const HandleGetMyProfile = createAsyncThunk(
    "HREmployees/getMyProfile",
    async (_, { rejectWithValue }) => {
      try {
        const response = await apiService.get(
          EmployeeSelfEndPoints.GET_MY_PROFILE,
          { withCredentials: true }
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data);
      }
    }
  );
  export const HandleUpdateMyProfile = createAsyncThunk(
    "HREmployees/updateMyProfile",
    async (formData, { getState, rejectWithValue }) => {
      try {
        const state = getState();
        const employeeId = state.HREmployeesPageReducer?.employeeData?.data?._id;

        if (!employeeId) {
          return rejectWithValue({ message: 'Không tìm thấy ID nhân viên' });
        }

        const response = await apiService.patch(
          EmployeeSelfEndPoints.UPDATE_MY_PROFILE,
          {
            employeeId: employeeId,
            updatedEmployee: formData,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data || { message: "Cập nhật thất bại" }
        );
      }
    }
);