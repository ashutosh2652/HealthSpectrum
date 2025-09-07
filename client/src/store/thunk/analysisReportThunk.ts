// src/features/analysisReport/analysisReportThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

// ---------------- Types ----------------
export interface ConditionDetected {
  name: string;
  confidence: number;
  userFeedback?: string;
}

export interface AnalysisReport {
  _id: string;
  patientId: string;
  conditionsDetected: ConditionDetected[];
  sourceDocuments?: string[];
  summary?: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

// ---------------- API URL ----------------
const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/analysisReports`;

// 🔹 Create Report
export const createReportThunk = createAsyncThunk<
  AnalysisReport,
  Partial<AnalysisReport>,
  { rejectValue: string }
>("analysisReports/createReport", async (reportData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<ApiResponse<AnalysisReport>>(
      `${API_URL}`,
      reportData,
      { withCredentials: true }
    );
    return data.data;
  } catch (err) {
    const error: AxiosError<{ message: string }> = err as AxiosError<{
      message: string;
    }>;
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 🔹 Get Report By ID
export const getReportByIdThunk = createAsyncThunk<
  AnalysisReport,
  string,
  { rejectValue: string }
>("analysisReports/getReportById", async (reportId, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<ApiResponse<AnalysisReport>>(
      `${API_URL}/${reportId}`,
      { withCredentials: true }
    );
    return data.data;
  } catch (err) {
    const error: AxiosError<{ message: string }> = err as AxiosError<{
      message: string;
    }>;
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 🔹 List Reports By Patient
export const listReportsByPatientThunk = createAsyncThunk<
  AnalysisReport[],
  string,
  { rejectValue: string }
>(
  "analysisReports/listReportsByPatient",
  async (patientId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<ApiResponse<AnalysisReport[]>>(
        `${API_URL}/patient/${patientId}`,
        { withCredentials: true }
      );
      return data.data;
    } catch (err) {
      const error: AxiosError<{ message: string }> = err as AxiosError<{
        message: string;
      }>;
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 🔹 Update Report Feedback
export const updateReportFeedbackThunk = createAsyncThunk<
  AnalysisReport,
  { reportId: string; conditionIndex: number; userFeedback: string },
  { rejectValue: string }
>(
  "analysisReports/updateReportFeedback",
  async ({ reportId, conditionIndex, userFeedback }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put<ApiResponse<AnalysisReport>>(
        `${API_URL}/${reportId}/feedback`,
        { conditionIndex, userFeedback },
        { withCredentials: true }
      );
      return data.data;
    } catch (err) {
      const error: AxiosError<{ message: string }> = err as AxiosError<{
        message: string;
      }>;
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 🔹 Delete Report
export const deleteReportThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("analysisReports/deleteReport", async (reportId, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/${reportId}`, {
      withCredentials: true,
    });
    return reportId;
  } catch (err) {
    const error: AxiosError<{ message: string }> = err as AxiosError<{
      message: string;
    }>;
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});
