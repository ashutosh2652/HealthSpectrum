import mongoose from "mongoose";
const { Schema, model } = mongoose;

const sourceDocumentSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    fileName: { type: String, required: true },
    storageUrl: { type: String, required: true },
    rawText: { type: String },
  },
  { timestamps: true }
);

export const SourceDocument = model("SourceDocument", sourceDocumentSchema);
