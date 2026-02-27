import { createSlice } from "@reduxjs/toolkit";
import { HRAsyncReducer } from "../AsyncReducers/asyncreducer.js";
import { HandleGetReport } from "../Thunks/ReportThunk.js";

const ReportSlice = createSlice({
  name: "Report",
  initialState: {
    data: null,
    file: null, // dùng cho blob nếu export PDF/Excel
    isLoading: false,
    isExportSuccess: false,
    error: {
      status: false,
      message: null,
      content: null,
    },
  },
  reducers: {
    ClearReportState: (state) => {
      state.data = null;
      state.file = null;
      state.isExportSuccess = false;
      state.error = {
        status: false,
        message: null,
        content: null,
      };
    },
  },
  extraReducers: (builder) => {
    HRAsyncReducer(builder, HandleGetReport);
  },
});

export const { ClearReportState } = ReportSlice.actions;

export default ReportSlice.reducer;