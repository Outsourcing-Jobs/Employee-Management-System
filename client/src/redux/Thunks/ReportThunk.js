import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../apis/apiService.js";
import { ReportEndPoints } from "../apis/APIsEndpoints.js";

export const HandleGetReport = createAsyncThunk(
  "HandleGetReport",
  async (reportData, { rejectWithValue }) => {
    try {
      const { apiroute, params, responseType } = reportData;
      console.log("Fetching report with data:", reportData);  
      const response = await apiService.get(
        ReportEndPoints[apiroute],
        {
          params,
          responseType: responseType ?? "blob",
          withCredentials: true,
        }
      );
      console.log("Report response:", response);
      const disposition = response.headers["content-disposition"];
      console.log("Content-Disposition:", disposition);
      const contentType = response.headers["content-type"];

      let fileName = "report";

      if (contentType.includes("application/pdf")) {
        fileName += ".pdf";
      }

      if (contentType.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
        fileName += ".xlsx";
      }

      if (disposition) {
        const match = disposition.match(/filename="?(.+)"?/);
        if (match?.[1]) fileName = match[1];
      }

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);