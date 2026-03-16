import { createSlice } from "@reduxjs/toolkit";
import { GenerateRequestAsyncReducer } from "../AsyncReducers/asyncreducer.js";

import {
  HandleGetRequests,
  HandleCreateRequest,
  HandleDeleteRequest,
  HandleUpdateRequestContent,
  HandleUpdateRequestStatus,
  HandleGetRequestByID,
  HandleGetMyRequests,
} from "../Thunks/GenerateRequestThunk";

const GenerateRequestSlice = createSlice({
  name: "GenerateRequest",
  initialState: {
    data: [],
    selectedRequest: null,
    isLoading: false,
    success: false,
    fetchData: false,
    error: {
      status: false,
      message: null,
      content: null,
    },
  },
  extraReducers: (builder) => {
    GenerateRequestAsyncReducer(builder, HandleGetRequests);
    GenerateRequestAsyncReducer(builder, HandleCreateRequest);
    GenerateRequestAsyncReducer(builder, HandleDeleteRequest);
    GenerateRequestAsyncReducer(builder, HandleUpdateRequestContent);
    GenerateRequestAsyncReducer(builder, HandleUpdateRequestStatus);
    GenerateRequestAsyncReducer(builder, HandleGetRequestByID);
    GenerateRequestAsyncReducer(builder, HandleGetMyRequests);
  },
});

export default GenerateRequestSlice.reducer;
