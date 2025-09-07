import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import patientRoutes from "./routes/patient.routes.js";
import authRoutes from "./routes/auth.routes.js";
import analysisReportRoutes from "./routes/analysisReport.routes.js";
import processingJobRoutes from "./routes/processingJob.routes.js";
import sourceDocumentRoutes from "./routes/sourceDocument.routes.js";
// import documentRoutes from './routes/document.routes.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/patients", patientRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reports", analysisReportRoutes);
app.use("/api/jobs", processingJobRoutes);
app.use("/api/documents", sourceDocumentRoutes);
// app.use('/api/documents', documentRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

export default app;
