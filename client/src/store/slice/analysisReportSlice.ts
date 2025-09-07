// src/features/analysisReport/analysisReportSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import {
  createReportThunk,
  getReportByIdThunk,
  listReportsByPatientThunk,
  updateReportFeedbackThunk,
  deleteReportThunk,
  AnalysisReport,
} from "../thunk/analysisReportThunk.ts";

interface AnalysisReportState {
  reports: AnalysisReport[];
  currentReport: AnalysisReport | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnalysisReportState = {
  reports: [],
  currentReport: null,
  loading: false,
  error: null,
};

const analysisReportSlice = createSlice({
  name: "analysisReports",
  initialState,
  reducers: {
    clearReportState: (state) => {
      state.currentReport = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Create Report
      .addCase(createReportThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReportThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.reports.unshift(action.payload);
      })
      .addCase(createReportThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🔹 Get Report By ID
      .addCase(getReportByIdThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReportByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReport = action.payload;
      })
      .addCase(getReportByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🔹 List Reports By Patient
      .addCase(listReportsByPatientThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(listReportsByPatientThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(listReportsByPatientThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🔹 Update Report Feedback
      .addCase(updateReportFeedbackThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateReportFeedbackThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReport = action.payload;
        const index = state.reports.findIndex(
          (r) => r._id === action.payload._id
        );
        if (index !== -1) state.reports[index] = action.payload;
      })
      .addCase(updateReportFeedbackThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🔹 Delete Report
      .addCase(deleteReportThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteReportThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = state.reports.filter((r) => r._id !== action.payload);
      })
      .addCase(deleteReportThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearReportState } = analysisReportSlice.actions;
export default analysisReportSlice.reducer;
