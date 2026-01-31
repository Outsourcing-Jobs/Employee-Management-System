import { createSlice } from "@reduxjs/toolkit";
import { HandleCreateNotice, HandleDeleteNotice, HandleGetAllNotices, HandleUpdateNotice } from "../Thunks/NoticeThunk";


const NoticeSlice = createSlice({
    name: "NoticeSlice",
    initialState: {
        isLoading: false,
        notices: [],
        fetchData: true
    },
    extraReducers: (builder) => {
        builder
            .addCase(HandleGetAllNotices.pending, (state) => { state.isLoading = true; })
            .addCase(HandleGetAllNotices.fulfilled, (state, action) => {
                state.isLoading = false;
                state.notices = action.payload.data || [];
                state.fetchData = false;
            })
            .addCase(HandleCreateNotice.fulfilled, (state) => { state.fetchData = true; })
            .addCase(HandleDeleteNotice.fulfilled, (state) => { state.fetchData = true; })
            .addCase(HandleUpdateNotice.fulfilled, (state) => { state.fetchData = true; });
    }
});
export default NoticeSlice.reducer;