// store/jobsSlice.js
import { createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// // Async thunk to fetch jobs data
// export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async () => {
//   const response = await axios.get("https://api.example.com/jobs");
//   return response.data;
// });

const jobsSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    status: "idle",
    error: null,
  },
  reducers: {},
});

export default jobsSlice.reducer;
