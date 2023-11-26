import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPosts, fetchSubRedditPosts, fetchPostsByFilter } from "./api.js";

export const loadPosts = createAsyncThunk('feed/loadPostsById', async ({ subReddit, option }) => {
  try {
    if (subReddit && (option !== "new" && option !== "top")) {
      const response = await fetchSubRedditPosts(subReddit);
      return response;
    } else if (option === "new" || option === "top") {
      const response = await fetchPostsByFilter(option);
      return response;
    } else {
      const response = await fetchPosts();
      return response;
    }
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
      .addCase(loadPosts.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(loadPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasError = false;
        state.posts = [action.payload];
      })
      .addCase(loadPosts.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  }
  
});

export const { reducer } = feedSlice;
export const selectPosts = (state) => state.feed.posts;
export default feedSlice.reducer;