import mongoose from "mongoose";
const { Schema, model } = mongoose;

// ===================================================================
// Sub-schemas for Structured Clinical Data
// ===================================================================

const AllergySchema = new Schema({
  substance: { type: String, required: true }, // e.g., 'Peanuts', 'Penicillin'
  reaction: { type: String }, // e.g., 'Anaphylaxis', 'Hives'
  severity: { type: String, enum: ['mild', 'moderate', 'severe'] },
}, { _id: false });

const ConditionSchema = new Schema({
  name: { type: String, required: true }, // e.g., 'Type 2 Diabetes'
  diagnosedDate: { type: Date }, // When the condition was first diagnosed
  status: { type: String, enum: ['active', 'resolved', 'in_remission'] },
}, { _id: false });

const MedicationSchema = new Schema({
  name: { type: String, required: true }, // e.g., 'Metformin'
  dosage: { type: String }, // e.g., '500 mg'
  frequency: { type: String }, // e.g., 'Twice daily'
  reason: { type: String }, // Why the medication is taken
}, { _id: false });

const FamilyHistorySchema = new Schema({
  relative: { type: String, required: true }, // e.g., 'Mother', 'Father'
  condition: { type: String, required: true }, // e.g., 'Heart Disease'
}, { _id: false });

const ConsentSchema = new Schema(
  {
    consentType: {
      type: String,
      required: true,
      enum: ["TermsOfService", "PrivacyPolicy", "ResearchDataUse"],
    },
    status: { type: Boolean, required: true },
    dateRecorded: { type: Date, default: Date.now },
  },
  { _id: false }
);

// ===================================================================
// Main Patient Schema
// ===================================================================
const patientSchema = new Schema(
  {
    // --- Required Demographics ---
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    contactInfo: {
      phone: {type:String, required: true },
      email: { type: String, lowercase: true},
      address: String,
    },

    // --- Optional Clinical Details (Can be filled by user or AI) ---
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },
    heightCm: Number,
    weightKg: Number,

    // --- Structured Clinical History (Defaults to empty) ---
    allergies: { type: [AllergySchema], default: [] },
    chronicDiseases: { type: [ConditionSchema], default: [] },
    currentMedications: { type: [MedicationSchema], default: [] },
    familyHistory: { type: [FamilyHistorySchema], default: [] },

    // --- Lifestyle & Social History (Optional) ---
    lifestyle: {
      smoking: { type: Boolean, default: false },
      alcohol: { type: Boolean, default: false },
      exerciseFrequency: String,
      dietPreference: String,
    },
    maritalStatus: {
      type: {type:String, required:true},
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },

    // --- Legal Consents ---
    consents: { type: [ConsentSchema], default: [] },
  },
  { timestamps: true }
);

export const Patient = model("Patient", patientSchema);