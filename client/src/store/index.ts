import { configureStore } from "@reduxjs/toolkit";

// Import reducers
import authReducer from "./slice/authSlice";
import patientReducer from "./slice/patientSlice";
import analysisReportReducer from "./slice/analysisReportSlice";
import processingJobReducer from "./slice/processingJobSlice";
import sourceDocumentReducer from "./slice/sourceDocumentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientReducer,
    analysisReports: analysisReportReducer,
    processingJobs: processingJobReducer,
    sourceDocuments: sourceDocumentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // in case you're dealing with non-serializable values
    }),
});

// ✅ Types for RootState & AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
