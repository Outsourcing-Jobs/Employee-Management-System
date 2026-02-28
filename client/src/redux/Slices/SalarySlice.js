import { createSlice } from "@reduxjs/toolkit";
import { HandleGetAllSalaries, HandleGetSalaryDetail } from "../Thunks/SalaryThunk";


const SalarySlice = createSlice({
  name: "SalarySlice",
  initialState: {
    isLoading: false,
    isDetailLoading: false,
    salaries: [],
    currentSalary: null,
    fetchData: true,
  },
  extraReducers: (builder) => {
    builder
      .addCase(HandleGetAllSalaries.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(HandleGetAllSalaries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.salaries = action.payload.data || [];
        state.fetchData = false;
      })
      .addCase(HandleGetAllSalaries.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(HandleGetSalaryDetail.pending, (state) => {
        state.isDetailLoading = true;
        state.currentSalary = null; 
      })
      .addCase(HandleGetSalaryDetail.fulfilled, (state, action) => {
        state.isDetailLoading = false;
        state.currentSalary = action.payload.data;
      })
      .addCase(HandleGetSalaryDetail.rejected, (state) => {
        state.isDetailLoading = false;
      });
  },
});

export default SalarySlice.reducer;