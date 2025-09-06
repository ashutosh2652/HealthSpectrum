import express from "express";
import {
    analyzeDocument,
    uploadMiddleware,
} from "../controllers/Analysis.controllers.js";

const router = express.Router();

// POST /api/analyze - Analyze a document
router.post("/analyze", uploadMiddleware, analyzeDocument);

// GET /api/analysis/history - Get analysis history (placeholder)
router.get("/analysis/history", (req, res) => {
    // In a real app, you'd fetch from database
    // For now, return empty array since we're using localStorage on frontend
    res.json([]);
});

// GET /api/analysis/:id - Get specific analysis (placeholder)
router.get("/analysis/:id", (req, res) => {
    // In a real app, you'd fetch from database by ID
    res.status(404).json({ error: "Analysis not found" });
});

export default router;
