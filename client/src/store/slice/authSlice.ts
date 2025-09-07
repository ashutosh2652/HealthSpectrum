// src/slice/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import {
  registerUserThunk,
  loginUserThunk,
  logoutUserThunk,
  getUserProfileThunk,
  linkPatientToUserThunk,
} from "../thunk/authThunk.ts";

/**
 * Define your domain models
 */
export interface Patient {
  _id: string;
  name?: string;
  age?: number;
  gender?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
  };
}

export interface User {
  _id: string;
  email: string;
  userName: string;
  clerkId: string;
  linkedPatients?: Patient[];
  token?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  linkedPatients: Patient[];
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  linkedPatients: [],
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // REGISTER
    builder.addCase(registerUserThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(registerUserThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data as User;
      state.error = null;
    });
    builder.addCase(registerUserThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // LOGIN
    builder.addCase(loginUserThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginUserThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data.user as User;
      state.token = action.payload.data.token as string;
      state.error = null;
    });
    builder.addCase(loginUserThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // LOGOUT
    builder.addCase(logoutUserThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
      state.token = null;
      state.linkedPatients = [];
      state.error = null;
    });
    builder.addCase(logoutUserThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // PROFILE
    builder.addCase(getUserProfileThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUserProfileThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data as User;
      state.linkedPatients = (action.payload.data.linkedPatients ||
        []) as Patient[];
      state.error = null;
    });
    builder.addCase(getUserProfileThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // LINK PATIENT
    builder.addCase(linkPatientToUserThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(linkPatientToUserThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.linkedPatients = (action.payload.data.linkedPatients ||
        []) as Patient[];
      state.error = null;
    });
    builder.addCase(linkPatientToUserThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
