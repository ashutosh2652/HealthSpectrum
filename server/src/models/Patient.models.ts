import { Schema, model, Document } from "mongoose";

export interface IConsent {
  consentType: string;   
  status: boolean;      
  dateRecorded: Date; 
}

export interface IPatient extends Document {
  name: string;
  age?: number;
  gender?: "male" | "female" | "other";
  dob?: Date;
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
  heightCm?: number;
  weightKg?: number;
  allergies?: string[];
  chronicDiseases?: string[];
  currentMedications?: string[];
  familyHistory?: string[];
  lifestyle?: {
    smoking?: boolean;
    alcohol?: boolean;
    exerciseFrequency?: string;
    dietPreference?: string;
  };

  maritalStatus?: "Single" | "Married" | "Divorced" | "Widowed";
  consents?: IConsent[];

  createdAt?: Date;
  updatedAt?: Date;
}

const ConsentSchema = new Schema<IConsent>(
  {
    consentType: { type: String, required: true },
    status: { type: Boolean, required: true },
    dateRecorded: { type: Date, default: Date.now },
  },
  { _id: false }
);

const patientSchema = new Schema<IPatient>(
  {
    name: { type: String, required: true },
    age: Number,
    gender: { type: String, enum: ["male", "female", "other"] },
    dob: Date,

    contactInfo: {
      phone: String,
      email: { type: String, lowercase: true },
      address: String,
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },
    heightCm: Number,
    weightKg: Number,

    allergies: [String],
    chronicDiseases: [String],
    currentMedications: [String],
    familyHistory: [String],

    lifestyle: {
      smoking: { type: Boolean, default: false },
      alcohol: { type: Boolean, default: false },
      exerciseFrequency: String,
      dietPreference: String,
    },

    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },

    consents: { type: [ConsentSchema], default: [] },
  },
  { timestamps: true }
);
export const Patient = model<IPatient>("Patient", patientSchema);