import { createSlice } from "@reduxjs/toolkit";
import { HREmployeesPageAsyncReducer } from "../AsyncReducers/asyncreducer.js";
import { HandleDeleteHREmployees, HandlePostHREmployees, HandleGetHREmployees, HandleGetMyProfile, HandleUpdateMyProfile } from "../Thunks/HREmployeesThunk.js";

const HREmployeesSlice = createSlice({
    name: "HREmployees",
    initialState: {
        data: null, 
        isLoading: false,
        success: false,
        fetchData : false, 
        employeeData : null,
        error: {
            status: false,
            message: null,
            content: null
        }
    },
    extraReducers: (builder) => {
        HREmployeesPageAsyncReducer(builder, HandleGetHREmployees) 
        HREmployeesPageAsyncReducer(builder, HandlePostHREmployees)
        HREmployeesPageAsyncReducer(builder, HandleDeleteHREmployees)
        builder
      .addCase(HandleGetMyProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(HandleGetMyProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employeeData = action.payload;
      })
      .addCase(HandleGetMyProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(HandleUpdateMyProfile.fulfilled, (state, action) => {
        state.employeeData = action.payload;
      });
    }
})

export default HREmployeesSlice.reducer