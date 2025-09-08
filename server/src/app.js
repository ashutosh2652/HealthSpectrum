import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

// Import routes
import patientRoutes from "./routes/patient.routes.js";
import authRoutes from "./routes/auth.routes.js";
import analysisReportRoutes from "./routes/analysisReport.routes.js";
import processingJobRoutes from "./routes/processingJob.routes.js";
import sourceDocumentRoutes from "./routes/sourceDocument.routes.js";

import dotenv from "dotenv";
dotenv.config();
import geminiRoutes from "./routes/gemini.routes.js";
import session from "express-session";

dotenv.config();

const app = express();

const allowedOrigins = [
    "https://health-spectrum.vercel.app",
    "https://healthspectrum.onrender.com",
    "http://localhost:8080",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.use((req, res, next) => {
    const origin = req.headers.origin;
    res.header("Access-Control-Allow-Origin", origin || "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, Pragma, Clerk-Signature, clerk-signature"
    );

    if (req.method === "OPTIONS") return res.status(204).end();
    next();
});

app.use(helmet());

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// API Routes
app.use("/api", geminiRoutes);

app.use(
    session({
        secret: process.env.SESSION_SECRET || "change_me",
        resave: false,
        saveUninitialized: false,
    })
);

app.use("/api/patients", patientRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reports", analysisReportRoutes);
app.use("/api/jobs", processingJobRoutes);
app.use("/api/documents", sourceDocumentRoutes);
// Global error handler
app.use((err, req, res, next) => {
    console.error("Global error handler:", err);
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            error: "File too large",
            message: "File size exceeds 50MB limit",
        });
    }
    res.status(err.status || 500).json({
        error: err.message || "Internal server error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found",
        message: `Cannot ${req.method} ${req.originalUrl}`,
        availableEndpoints: [
            "GET /",
            "GET /health",
            "POST /api/analyze",
            "GET /api/test",
        ],
    });
});

export default app;
