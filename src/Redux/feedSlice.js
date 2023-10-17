import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPosts } from "./api";

export const loadPostsById = createAsyncThunk('feed/loadPostsById', async (id, thunkAPI) => {
    try {
        const response = await fetchPosts(id);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        throw error; 
    }
});


const feedSlice = createSlice({
  name: "feed",
  initialState: {
    posts: [],
    isLoading: false,
    hasError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadPostsById.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(loadPostsById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasError = false;
        state.posts = action.payload;
      })
      .addCase(loadPostsById.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  }
  
});


export const { reducer } = feedSlice;
export const selectPosts = (state) => state.feed.posts;
export default feedSlice.reducer;