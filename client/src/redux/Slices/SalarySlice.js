import { createSlice } from "@reduxjs/toolkit";
import { HandleGetAllSalaries } from "../Thunks/SalaryThunk";


const SalarySlice = createSlice({
  name: "SalarySlice",
  initialState: {
    isLoading: false,
    salaries: [],
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
      });
  },
});

export default SalarySlice.reducer;