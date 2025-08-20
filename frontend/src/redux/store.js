// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import jobsReducer from "./jobSlice";

const store = configureStore({
  reducer: {
    jobs: jobsReducer,
  },
});

export default store;
