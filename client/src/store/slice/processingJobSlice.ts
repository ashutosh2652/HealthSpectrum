import { createSlice } from "@reduxjs/toolkit";
import {
  createJobThunk,
  updateJobStatusThunk,
  getJobByIdThunk,
  listJobsByPatientThunk,
  ProcessingJob,
} from "../thunk/processingJobThunk.ts";

interface ProcessingJobState {
  jobs: ProcessingJob[];
  selectedJob?: ProcessingJob;
  loading: boolean;
  error: string | null;
}

const initialState: ProcessingJobState = {
  jobs: [],
  selectedJob: undefined,
  loading: false,
  error: null,
};

const processingJobSlice = createSlice({
  name: "processingJobs",
  initialState,
  reducers: {
    clearSelectedJob(state) {
      state.selectedJob = undefined;
    },
    clearJobError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create job
    builder.addCase(createJobThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createJobThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.jobs.push(action.payload);
    });
    builder.addCase(createJobThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Create job failed";
    });

    // Update job
    builder.addCase(updateJobStatusThunk.fulfilled, (state, action) => {
      state.jobs = state.jobs.map((job) =>
        job._id === action.payload._id ? action.payload : job
      );
      if (state.selectedJob && state.selectedJob._id === action.payload._id) {
        state.selectedJob = action.payload;
      }
    });

    // Get by ID
    builder.addCase(getJobByIdThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getJobByIdThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedJob = action.payload;
    });
    builder.addCase(getJobByIdThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Fetch job failed";
    });

    // List jobs by patient
    builder.addCase(listJobsByPatientThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(listJobsByPatientThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.jobs = action.payload;
    });
    builder.addCase(listJobsByPatientThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Fetch jobs failed";
    });
  },
});

export const { clearSelectedJob, clearJobError } = processingJobSlice.actions;
export default processingJobSlice.reducer;
