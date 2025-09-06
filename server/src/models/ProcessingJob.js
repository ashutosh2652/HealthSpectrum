import mongoose from "mongoose";
const { Schema, model } = mongoose;

const processingJobSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    sourceDocumentIds: [{
      type: Schema.Types.ObjectId,
      ref: 'SourceDocument',
    }],
    status: {
      type: String,
      enum: ["pending", "processing_ocr", "processing_nlp", "completed", "failed"],
      default: "pending",
      required: true,
    },
    analysisReportId: {
      type: Schema.Types.ObjectId,
      ref: 'AnalysisReport',
    },
    errorLog: { type: String },
  },
  { timestamps: true }
);

export const ProcessingJob = model("ProcessingJob", processingJobSchema);
