import { Router } from "express";
import {
  createReport,
  getReportById,
  listReportsByPatient,
  updateReportFeedback,
  deleteReport,
} from "../controllers/analysisReport.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkAnalysisReportAccess } from "../middleware/analysisReport.middleware.js";

const router = Router();

// Apply JWT verification to all routes
router.use(verifyToken);

// Correct order (patient route first)
router.get("/patient/:patientId", checkAnalysisReportAccess, listReportsByPatient);
router.post("/", checkAnalysisReportAccess, createReport);
router.get("/:id", checkAnalysisReportAccess, getReportById);
router.put("/:id/feedback", checkAnalysisReportAccess, updateReportFeedback);
router.delete("/:id", checkAnalysisReportAccess, deleteReport);

export default router;
