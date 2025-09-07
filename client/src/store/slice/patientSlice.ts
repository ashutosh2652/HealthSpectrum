// src/features/patient/patientSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import {
  createPatientThunk,
  listPatientsThunk,
  getPatientByIdThunk,
  updatePatientThunk,
  deletePatientThunk,
  Patient,
} from "../thunk/patientThunk.ts";

interface PatientState {
  patients: Patient[];
  currentPatient: Patient | null;
  loading: boolean;
  error: string | null;
}

const initialState: PatientState = {
  patients: [],
  currentPatient: null,
  loading: false,
  error: null,
};

const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    clearPatientState: (state) => {
      state.currentPatient = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Create Patient
      .addCase(createPatientThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPatientThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.patients.unshift(action.payload);
      })
      .addCase(createPatientThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🔹 List Patients
      .addCase(listPatientsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(listPatientsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload;
      })
      .addCase(listPatientsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🔹 Get Patient By ID
      .addCase(getPatientByIdThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPatientByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPatient = action.payload;
      })
      .addCase(getPatientByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🔹 Update Patient
      .addCase(updatePatientThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePatientThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPatient = action.payload;
        const idx = state.patients.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.patients[idx] = action.payload;
      })
      .addCase(updatePatientThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🔹 Delete Patient
      .addCase(deletePatientThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePatientThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = state.patients.filter((p) => p._id !== action.payload);
      })
      .addCase(deletePatientThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPatientState } = patientSlice.actions;
export default patientSlice.reducer;
