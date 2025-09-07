import { AnalysisReport } from "../models/AnalysisReport.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createReport = asyncHandler(async (req, res) => {
  const { patientId, conditionsDetected, sourceDocuments, summary } = req.body;

  if (!patientId || !Array.isArray(conditionsDetected)) {
    throw new ApiError(400, "Required fields missing or invalid");
  }

  const report = await AnalysisReport.create({
    patientId,
    conditionsDetected,
    sourceDocuments,
    summary,
    createdBy: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, report, "Report created"));
});

const getReportById = asyncHandler(async (req, res) => {
  const report = await AnalysisReport.findById(req.params.id)
    .populate("patientId")
    .populate("sourceDocuments")
    .populate("createdBy", "name email");

  if (!report) throw new ApiError(404, "Report not found");
  res.json(new ApiResponse(200, report, "Report fetched"));
});

const listReportsByPatient = asyncHandler(async (req, res) => {
  const reports = await AnalysisReport.find({ patientId: req.params.patientId })
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  res.json(new ApiResponse(200, reports, "Reports fetched"));
});

const updateReportFeedback = asyncHandler(async (req, res) => {
  const { conditionIndex, userFeedback } = req.body;
  const report = await AnalysisReport.findById(req.params.id);
  if (!report) throw new ApiError(404, "Report not found");

  if (report.conditionsDetected[conditionIndex]) {
    report.conditionsDetected[conditionIndex].userFeedback = userFeedback;
    await report.save();
  } else {
    throw new ApiError(400, "Invalid condition index");
  }

  res.json(new ApiResponse(200, report, "Feedback updated"));
});

const deleteReport = asyncHandler(async (req, res) => {
  const report = await AnalysisReport.findByIdAndDelete(req.params.id);
  if (!report) throw new ApiError(404, "Report not found");
  res.json(new ApiResponse(200, report, "Report deleted"));
});

export {
  createReport,
  getReportById,
  listReportsByPatient,
  updateReportFeedback,
  deleteReport,
};
