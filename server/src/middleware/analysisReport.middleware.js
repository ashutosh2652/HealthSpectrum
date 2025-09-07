import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AnalysisReport } from "../models/AnalysisReport.js";

// Helper to check patient access robustly
const hasAccessToPatient = (linkedPatients, patientId) => {
  return linkedPatients.some(p => {
    if (!p) return false;
    if (typeof p === "string") return p === patientId;
    if (p._id) return p._id.toString() === patientId;
    return p.toString() === patientId;
  });
};

export const checkAnalysisReportAccess = asyncHandler(async (req, res, next) => {
  const reportId = req.params.id;
  const patientId = req.params.patientId || (req.method === "POST" ? req.body.patientId : null);

  // POST (creating report)
  if (req.method === "POST") {
    if (!patientId) throw new ApiError(400, "Patient ID is required");
    if (!hasAccessToPatient(req.user.linkedPatients, patientId)) {
      throw new ApiError(403, "You don't have access to create reports for this patient");
    }
    return next();
  }

  // Requests with :id (get by id, update, delete)
  if (reportId) {
    const report = await AnalysisReport.findById(reportId).select("patientId");
    if (!report) throw new ApiError(404, "Analysis report not found");
    if (!hasAccessToPatient(req.user.linkedPatients, report.patientId.toString())) {
      throw new ApiError(403, "You don't have access to this analysis report");
    }
  }

  // GET requests by patientId (list)
  if (patientId && !reportId) {
    if (!hasAccessToPatient(req.user.linkedPatients, patientId)) {
      throw new ApiError(403, "You don't have access to reports for this patient");
    }
  }

  next();
});
