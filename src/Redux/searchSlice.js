import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSearchResults } from "./api";

export const loadResults = createAsyncThunk('search/loadResults', async ({ searchQuery, type }) => {
    try {
        const response = await fetchSearchResults(searchQuery, type);
        console.log(response);
        return response;
    } catch (error) {
        throw error;
    }
});

const searchSlice = createSlice({
    name: "search",
    initialState: {
        results: [],
        isLoading: false,
        hasError: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadResults.pending, (state) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(loadResults.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasError = false;
                state.results = [action.payload];
            })
            .addCase(loadResults.rejected, (state) => {
                state.isLoading = false;
                state.hasError = true;
            });
    }
});

export const { reducer } = searchSlice;
export const selectSearchResults = (state) => state.search.results;
export default searchSlice.reducer; 
