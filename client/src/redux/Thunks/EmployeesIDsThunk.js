import { createAsyncThunk } from "@reduxjs/toolkit";
import { EmployeesIDsEndPoints } from "../apis/APIsEndpoints.js";
import { apiService } from "../apis/apiService.js";

export const fetchEmployeesIDs = createAsyncThunk("fetchEmployeesIDs", async (fetchdata, { rejectWithValue }) => {
    try {
        const { apiroute } = fetchdata
        const response = await apiService.get(`${EmployeesIDsEndPoints[apiroute]}`, {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})