// middleware/processingJob.middleware.js
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ProcessingJob } from "../models/ProcessingJob.js";

// Helper to check if user has access to patient
const hasAccessToPatient = (linkedPatients, patientId) => {
  return linkedPatients.some(p => {
    if (!p) return false;
    if (typeof p === "string") return p === patientId;
    if (p._id) return p._id.toString() === patientId;
    return p.toString() === patientId;
  });
};

export const checkProcessingJobAccess = asyncHandler(async (req, res, next) => {
  const jobId = req.params.id;
  const patientId = req.params.patientId || (req.method === "POST" ? req.body.patientId : null);

  // ✅ For job creation (POST)
  if (req.method === "POST") {
    if (!patientId) throw new ApiError(400, "Patient ID is required");
    if (!hasAccessToPatient(req.user.linkedPatients, patientId)) {
      throw new ApiError(403, "You don't have access to create jobs for this patient");
    }
    return next();
  }

  // ✅ For routes with jobId (GET by id, PUT update, DELETE in future)
  if (jobId) {
    const job = await ProcessingJob.findById(jobId).select("patientId");
    if (!job) throw new ApiError(404, "Processing job not found");

    if (!hasAccessToPatient(req.user.linkedPatients, job.patientId.toString())) {
      throw new ApiError(403, "You don't have access to this processing job");
    }
    return next();
  }

  // ✅ For list by patient
  if (patientId && !jobId) {
    if (!hasAccessToPatient(req.user.linkedPatients, patientId)) {
      throw new ApiError(403, "You don't have access to jobs for this patient");
    }
  }

  next();
});
