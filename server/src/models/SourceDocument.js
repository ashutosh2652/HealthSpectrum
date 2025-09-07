import mongoose from "mongoose";
const { Schema, model } = mongoose;

const sourceDocumentSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    fileName: {
      type: String,
      required: true, // fileName must be required now
    },
    storageUrl: {
      type: String,
      required: true,
    },
    rawText: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const SourceDocument = model("SourceDocument", sourceDocumentSchema);
