// src/thunk/authThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

// ---------------- Types ----------------
export interface User {
  _id: string;
  email: string;
  userName: string;
  clerkId: string;
  linkedPatients?: string[];
}

export interface AuthResponse {
  user: User;
  token?: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

// ---------------- Thunks ----------------
const BASE_URL = import.meta.env.VITE_API_URL;
// REGISTER
export const registerUserThunk = createAsyncThunk<
  User, // return type
  { email: string; userName: string; clerkId: string }, // argument type
  { rejectValue: string } // error type
>("auth/registerUser", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<ApiResponse<User>>(
      `${BASE_URL}/api/auth/register`,
      payload
    );
    return data.data;
  } catch (err) {
    const error: AxiosError<{ message: string }> = err as AxiosError<{
      message: string;
    }>;
    return rejectWithValue(
      error.response?.data?.message || "Registration failed"
    );
  }
});

// LOGIN
export const loginUserThunk = createAsyncThunk<
  AuthResponse,
  { email: string; clerkId: string },
  { rejectValue: string }
>("auth/loginUser", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<ApiResponse<AuthResponse>>(
      `${BASE_URL}/api/auth/login`,
      payload,
      { withCredentials: true }
    );
    return data.data;
  } catch (err) {
    const error: AxiosError<{ message: string }> = err as AxiosError<{
      message: string;
    }>;
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

// LOGOUT
export const logoutUserThunk = createAsyncThunk<
  { message: string },
  void,
  { rejectValue: string }
>("auth/logoutUser", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<{ message: string }>(
      `${BASE_URL}/api/auth/logout`,
      {},
      { withCredentials: true }
    );
    return data;
  } catch (err) {
    const error: AxiosError<{ message: string }> = err as AxiosError<{
      message: string;
    }>;
    return rejectWithValue(error.response?.data?.message || "Logout failed");
  }
});

// GET PROFILE
export const getUserProfileThunk = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("auth/getUserProfile", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<ApiResponse<User>>(
      `${BASE_URL}/api/auth/me`,
      {
        withCredentials: true,
      }
    );
    return data.data;
  } catch (err) {
    const error: AxiosError<{ message: string }> = err as AxiosError<{
      message: string;
    }>;
    return rejectWithValue(
      error.response?.data?.message || "Fetching profile failed"
    );
  }
});

// LINK PATIENT
export const linkPatientToUserThunk = createAsyncThunk<
  User,
  { patientId: string },
  { rejectValue: string }
>("auth/linkPatientToUser", async ({ patientId }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<ApiResponse<User>>(
      `${BASE_URL}/api/auth/link-patient`,
      { patientId },
      { withCredentials: true }
    );
    return data.data;
  } catch (err) {
    const error: AxiosError<{ message: string }> = err as AxiosError<{
      message: string;
    }>;
    return rejectWithValue(
      error.response?.data?.message || "Linking patient failed"
    );
  }
});
