// src/features/processingJob/processingJobThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

// ---------------- Types ----------------
export interface ProcessingJob {
  _id: string;
  patientId: string;
  sourceDocumentIds: string[];
  status: "pending" | "processing" | "completed" | "failed";
  errorLog?: string;
  analysisReportId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CreateJobPayload {
  patientId: string;
  sourceDocumentIds: string[];
}

interface UpdateJobStatusPayload {
  id: string;
  status: string;
  errorLog?: string;
  analysisReportId?: string;
}

const BASE_URL = import.meta.env.VITE_API_URL;
// ---------------- API URL ----------------
const API_URL = `${BASE_URL}/api/processing-jobs`;

// 🔹 Create a new processing job
export const createJobThunk = createAsyncThunk<
  ProcessingJob,
  CreateJobPayload,
  { rejectValue: string }
>("processingJobs/create", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<{ data: ProcessingJob }>(
      API_URL,
      payload,
      {
        withCredentials: true,
      }
    );
    return data.data;
  } catch (err) {
    const error: AxiosError<{ message: string }> = err as AxiosError<{
      message: string;
    }>;
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 🔹 Update job status
export const updateJobStatusThunk = createAsyncThunk<
  ProcessingJob,
  UpdateJobStatusPayload,
  { rejectValue: string }
>(
  "processingJobs/updateStatus",
  async ({ id, status, errorLog, analysisReportId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put<{ data: ProcessingJob }>(
        `${API_URL}/${id}/status`,
        {
          status,
          errorLog,
          analysisReportId,
        },
        {
          withCredentials: true,
        }
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

// 🔹 Get job by ID
export const getJobByIdThunk = createAsyncThunk<
  ProcessingJob,
  string,
  { rejectValue: string }
>("processingJobs/getById", async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<{ data: ProcessingJob }>(
      `${API_URL}/${id}`,
      {
        withCredentials: true,
      }
    );
    return data.data;
  } catch (err) {
    const error: AxiosError<{ message: string }> = err as AxiosError<{
      message: string;
    }>;
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 🔹 List jobs by patient
export const listJobsByPatientThunk = createAsyncThunk<
  ProcessingJob[],
  string,
  { rejectValue: string }
>("processingJobs/listByPatient", async (patientId, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<{ data: ProcessingJob[] }>(
      `${API_URL}/patient/${patientId}`,
      {
        withCredentials: true,
      }
    );
    return data.data;
  } catch (err) {
    const error: AxiosError<{ message: string }> = err as AxiosError<{
      message: string;
    }>;
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});
