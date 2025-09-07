import express from "express";
import multer from "multer";
import {
  extractDocument,
  getStatus,
  getOcrText,
  cancelProcessing,
  retryProcessing,
} from "../controllers/documentController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Upload + Extract
router.post("/extract", upload.single("file"), extractDocument);

// Status (used by frontend polling)
router.get("/:id/status", getStatus);

// OCR Text
router.get("/:id/ocrText", getOcrText);

// Cancel processing
router.post("/:id/cancel", cancelProcessing);

// Retry processing
router.post("/:id/retry", retryProcessing);

export default router;
