import { SourceDocument } from "../models/SourceDocument.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadonCloudinary, deleteMedia } from "../utils/cloudinary.js";

// Helper to check patient access safely
const hasAccessToPatient = (linkedPatients, patientId) => {
  return linkedPatients.some(p => {
    if (!p) return false;
    if (typeof p === "string") return p === patientId;
    if (p._id) return p._id.toString() === patientId;
    return p.toString() === patientId; // fallback for ObjectId
  });
};

const uploadDocument = asyncHandler(async (req, res) => {
  const { patientId, rawText } = req.body;

  if (!patientId) throw new ApiError(400, "Patient ID is required");
  if (!hasAccessToPatient(req.user.linkedPatients, patientId)) {
    throw new ApiError(403, "You don't have access to upload documents for this patient");
  }
  if (!req.file) throw new ApiError(400, "No file uploaded");

  const cloudRes = await uploadonCloudinary(req.file.path);
  if (!cloudRes || !cloudRes.secure_url) throw new ApiError(500, "Error uploading file to cloud storage");

  const doc = await SourceDocument.create({
    patientId,
    fileName: req.file.originalname,
    storageUrl: cloudRes.secure_url,
    cloudinaryId: cloudRes.public_id,
    rawText: rawText || "",
  });

  res.status(201).json(new ApiResponse(201, doc, "Document uploaded successfully"));
});

const getDocumentById = asyncHandler(async (req, res) => {
  const doc = await SourceDocument.findById(req.params.id);
  if (!doc) throw new ApiError(404, "Document not found");
  if (!hasAccessToPatient(req.user.linkedPatients, doc.patientId.toString())) {
    throw new ApiError(403, "You don't have access to this document");
  }
  res.json(new ApiResponse(200, doc, "Document fetched"));
});

const listDocumentsByPatient = asyncHandler(async (req, res) => {
  const patientId = req.params.patientId;
  if (!hasAccessToPatient(req.user.linkedPatients, patientId)) {
    throw new ApiError(403, "You don't have access to documents for this patient");
  }
  const docs = await SourceDocument.find({ patientId });
  res.json(new ApiResponse(200, docs, "Documents fetched"));
});

const deleteDocument = asyncHandler(async (req, res) => {
  const doc = await SourceDocument.findById(req.params.id);
  if (!doc) throw new ApiError(404, "Document not found");
  if (!hasAccessToPatient(req.user.linkedPatients, doc.patientId.toString())) {
    throw new ApiError(403, "You don't have access to delete this document");
  }

  // Use stored cloudinaryId for deletion
  if (doc.cloudinaryId) await deleteMedia({ publicId: doc.cloudinaryId, Type: "auto" });

  await doc.deleteOne();
  res.json(new ApiResponse(200, doc, "Document deleted successfully"));
});

export { uploadDocument, getDocumentById, listDocumentsByPatient, deleteDocument };