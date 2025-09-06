import mongoose from "mongoose";
const { Schema, model } = mongoose;

const analysisReportSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    sourceDocuments: [{
      type: Schema.Types.ObjectId,
      ref: 'SourceDocument',
    }],
    summary: {
      type: String,
    },
    conditionsDetected: [{
      name: { type: String, required: true },
      confidenceScore: { type: Number, required: true },
      estimatedOnsetDate: { type: Date },
      explanation: { type: String },
      evidenceSnippets: [{
        documentId: { type: Schema.Types.ObjectId, ref: 'SourceDocument' },
        text: { type: String },
        page: { type: Number }
      }],
      userFeedback: {
        isValidated: { type: Boolean, default: false },
        notes: { type: String }
      }
    }],
    medicationsMentioned: [{
      name: { type: String },
      dosage: { type: String },
      reason: { type: String }
    }],
    testsExplained: [{
      name: { type: String },
      reason: { type: String }
    }],
    futureRisks: [{
      text: { type: String },
      confidenceScore: { type: Number }
    }],
    recommendations: [{
      text: { type: String },
      urgency: {
        type: String,
        enum: ["normal", "soon", "urgent"],
        default: "normal",
      }
    }]
  },
  {
    timestamps: true
  }
);

export const AnalysisReport = model("AnalysisReport", analysisReportSchema);
