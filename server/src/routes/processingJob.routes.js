// routes/processingJob.routes.js
import { Router } from "express";
import {
  createJob,
  updateJobStatus,
  getJobById,
  listJobsByPatient,
} from "../controllers/processingJob.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkProcessingJobAccess } from "../middleware/processingJob.middleware.js";

const router = Router();

// Apply JWT verification to all routes
router.use(verifyToken);

// Order matters: patient route first
router.get("/patient/:patientId", checkProcessingJobAccess, listJobsByPatient);
router.post("/", checkProcessingJobAccess, createJob);
router.get("/:id", checkProcessingJobAccess, getJobById);
router.put("/:id/status", checkProcessingJobAccess, updateJobStatus);

export default router;
