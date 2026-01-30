import { createSlice } from "@reduxjs/toolkit";
import { HRProfileAsyncReducer } from "../AsyncReducers/asyncreducer.js";
import {
    HandleGetHRs,
    HandleDeleteHR,
    HandlePatchHR,
    HandleGetHRByID
} from "../Thunks/HRProfileThunk.js";

const HRSlice = createSlice({
    name: "HRManagement",
    initialState: {
        data: null,
        selectedHR: null,
        isLoading: false,
        success: false,
        fetchData: false,
        error: {
            status: false,
            message: null,
            content: null
        }
    },
    extraReducers: (builder) => {
        HRProfileAsyncReducer(builder, HandleGetHRs);
        HRProfileAsyncReducer(builder, HandleDeleteHR);
        HRProfileAsyncReducer(builder, HandlePatchHR);
        HRProfileAsyncReducer(builder, HandleGetHRByID);
    }
});

export default HRSlice.reducer;