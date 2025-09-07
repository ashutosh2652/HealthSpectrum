// controllers/processingJob.controller.js
import { ProcessingJob } from "../models/ProcessingJob.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createJob = asyncHandler(async (req, res) => {
  const { patientId, sourceDocumentIds } = req.body;
  const job = await ProcessingJob.create({ patientId, sourceDocumentIds });
  res.status(201).json(new ApiResponse(201, job, "Job created successfully"));
});

const updateJobStatus = asyncHandler(async (req, res) => {
  const { status, errorLog, analysisReportId } = req.body;
  console.log(status);
  console.log(errorLog);
  console.log(analysisReportId);
  
  
  
  
  const job = await ProcessingJob.findByIdAndUpdate(
    req.params.id,
    { status, errorLog, analysisReportId },
    { new: true }
  );
  if (!job) throw new ApiError(404, "Job not found");
  res.json(new ApiResponse(200, job, "Job status updated successfully"));
});

const getJobById = asyncHandler(async (req, res) => {
  const job = await ProcessingJob.findById(req.params.id);
  if (!job) throw new ApiError(404, "Job not found");
  res.json(new ApiResponse(200, job, "Job fetched successfully"));
});

const listJobsByPatient = asyncHandler(async (req, res) => {
  const jobs = await ProcessingJob.find({ patientId: req.params.patientId });
  res.json(new ApiResponse(200, jobs, "Jobs fetched successfully"));
});

export { createJob, updateJobStatus, getJobById, listJobsByPatient };
