import { fetchComments } from "./commentApi.js";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export const loadComments = createAsyncThunk('feed/loadCommentsById', async (postId) => {
    try {
        const response = await fetchComments(postId);
        return response;
    } catch (error) {
        throw error; 
    }
});

const commentSlice = createSlice({
    name: "comment",
    initialState: {
        comments: [],
        isLoading: false,
        hasError: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder 
            .addCase(loadComments.pending, (state) => {
                state.isLoading = true;
                state.hasError = false
            })
            .addCase(loadComments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasError = false;
                state.comments = [action.payload]; 
            })
            .addCase(loadComments.rejected, (state) => {
                state.isLoading = false;
                state.hasError = true;
            });
    }

});


export const { reducer } = commentSlice;
export const selectComment = (state) => state.comment.comments;
export default commentSlice.reducer;

