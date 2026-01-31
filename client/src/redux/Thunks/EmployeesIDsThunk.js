import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../apis/apiService.js";
import { EmployeesIDsEndPoints } from "../apis/APIsEndpoints.js";

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