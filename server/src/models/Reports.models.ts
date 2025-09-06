import { Schema, model, Document, Types } from "mongoose";
import { IPatient } from "./Patient.models.ts";

interface IMedication {
  name?: string;
  dosage?: string;
  notes?: string;
}

interface IAnalysis {
  summary?: string;
  diseasesDetected?: string[];
  medicationsSuggested?: IMedication[];
  severityLevel?: "low" | "moderate" | "high";
  acknowledgedByAI?: boolean;
}

export interface IReport extends Document {
  patientId: Types.ObjectId | IPatient;
  reportType?: string;
  uploadedFile?: string;
  rawText?: string;
  analysis?: IAnalysis;
  createdAt?: Date;
  updatedAt?: Date;
}

const medicationSchema = new Schema<IMedication>({
  name: String,
  dosage: String,
  notes: String,
});

const analysisSchema = new Schema<IAnalysis>({
  summary: String,
  diseasesDetected: [String],
  medicationsSuggested: [medicationSchema],
  severityLevel: { type: String, enum: ["low", "moderate", "high"] },
  acknowledgedByAI: { type: Boolean, default: false },
});

const reportSchema = new Schema<IReport>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    reportType: String,
    uploadedFile: String,
    rawText: String,
    analysis: analysisSchema,
  },
  { timestamps: true }
);

export const Report = model<IReport>("Report", reportSchema);