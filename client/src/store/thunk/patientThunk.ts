// src/features/patient/patientThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

// ---------------- Types ----------------
export interface ContactInfo {
  email?: string;
  phone?: string;
}

export interface Patient {
  _id: string;
  name?: string;
  age?: number;
  gender?: string;
  contactInfo?: ContactInfo;
  createdAt?: string;
  updatedAt?: string;
}

// ---------------- API URL ----------------
const API_URL = "/api/v1/patients";

// 🔹 Create Patient
export const createPatientThunk = createAsyncThunk<
  Patient,
  Partial<Patient>,
  { rejectValue: string }
>("patients/createPatient", async (patientData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<{ data: Patient }>(API_URL, patientData, {
      withCredentials: true,
    });
    return data.data;
  } catch (err) {
    const error: AxiosError<{ message: string }> = err as AxiosError<{ message: string }>;
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 🔹 List Patients
export const listPatientsThunk = createAsyncThunk<
  Patient[],
  void,
  { rejectValue: string }
>("patients/listPatients", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<{ data: Patient[] }>(API_URL, {
      withCredentials: true,
    });
    return data.data;
  } catch (err) {
    const error: AxiosError<{ message: string }> = err as AxiosError<{ message: string }>;
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 🔹 Get Patient By ID
export const getPatientByIdThunk = createAsyncThunk<
  Patient,
  string,
  { rejectValue: string }
>("patients/getPatientById", async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<{ data: Patient }>(`${API_URL}/${id}`, {
      withCredentials: true,
    });
    return data.data;
  } catch (err) {
    const error: AxiosError<{ message: string }> = err as AxiosError<{ message: string }>;
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 🔹 Update Patient
export const updatePatientThunk = createAsyncThunk<
  Patient,
  { id: string; updates: Partial<Patient> },
  { rejectValue: string }
>("patients/updatePatient", async ({ id, updates }, { rejectWithValue }) => {
  try {
    const { data } = await axios.put<{ data: Patient }>(`${API_URL}/${id}`, updates, {
      withCredentials: true,
    });
    return data.data;
  } catch (err) {
    const error: AxiosError<{ message: string }> = err as AxiosError<{ message: string }>;
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 🔹 Delete Patient
export const deletePatientThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("patients/deletePatient", async (id, { rejectWithValue }) => {
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
