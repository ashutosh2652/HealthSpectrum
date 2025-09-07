// src/features/sourceDocument/sourceDocumentThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

// ---------------- Types ----------------
export interface SourceDocument {
  _id: string;
  patientId: string;
  fileName: string;
  storageUrl: string;
  cloudinaryId?: string;
  rawText?: string;
  createdAt?: string;
}

interface UploadDocumentPayload {
  patientId: string;
  rawText?: string;
  file: File;
}

// ---------------- API URL ----------------
const API_URL = "/api/v1/source-documents";

// 🔹 Upload a new document
export const uploadDocumentThunk = createAsyncThunk<
  SourceDocument,
  UploadDocumentPayload,
  { rejectValue: string }
>("sourceDocuments/upload", async ({ patientId, rawText, file }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("patientId", patientId);
    if (rawText) formData.append("rawText", rawText);

    const { data } = await axios.post<{ data: SourceDocument }>(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    return data.data;
  } catch (err) {
    const error: AxiosError<{ message: string }> = err as AxiosError<{ message: string }>;
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 🔹 Get a document by ID
export const getDocumentByIdThunk = createAsyncThunk<
  SourceDocument,
  string,
  { rejectValue: string }
>("sourceDocuments/getById", async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<{ data: SourceDocument }>(`${API_URL}/${id}`, {
      withCredentials: true,
    });
    return data.data;
  } catch (err) {
    const error: AxiosError<{ message: string }> = err as AxiosError<{ message: string }>;
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 🔹 List documents by patient
export const listDocumentsByPatientThunk = createAsyncThunk<
  SourceDocument[],
  string,
  { rejectValue: string }
>("sourceDocuments/listByPatient", async (patientId, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<{ data: SourceDocument[] }>(`${API_URL}/patient/${patientId}`, {
      withCredentials: true,
    });
    return data.data;
  } catch (err) {
    const error: AxiosError<{ message: string }> = err as AxiosError<{ message: string }>;
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 🔹 Delete a document
export const deleteDocumentThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("sourceDocuments/delete", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      withCredentials: true,
    });
    return id;
  } catch (err) {
    const error: AxiosError<{ message: string }> = err as AxiosError<{ message: string }>;
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});
