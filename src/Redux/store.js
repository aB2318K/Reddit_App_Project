import feedReducer from "./feedSlice";
import commentReducer from "./commentSlice";
import searchReducer from "./searchSlice";

import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: {
        feed: feedReducer,
        comment: commentReducer,
        search: searchReducer,
    }
});
