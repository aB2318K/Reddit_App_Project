import feedSliceReducer from "./feedSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: {
        feed: feedSliceReducer,
    }
});
