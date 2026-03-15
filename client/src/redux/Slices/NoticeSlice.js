import { createSlice } from "@reduxjs/toolkit";
import { HandleCreateNotice, HandleDeleteNotice, HandleGetAllNotices, HandleGetMyNotices, HandleUpdateNotice } from "../Thunks/NoticeThunk";


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
            .addCase(HandleUpdateNotice.fulfilled, (state) => { state.fetchData = true; })
            .addCase(HandleGetMyNotices.pending, (state) => { 
                state.isLoading = true;
                state.error = { status: false, message: null };
            })
            .addCase(HandleGetMyNotices.fulfilled, (state, action) => { 
                state.isLoading = false;
                state.notices = action.payload.data || [];
            })
            .addCase(HandleGetMyNotices.rejected, (state, action) => {
                state.isLoading = false;
                state.error = {
                    status: true,
                    message: action.payload?.message || "Không thể tải thông báo của nhân viên",
                };
            })
    }
});
export default NoticeSlice.reducer;