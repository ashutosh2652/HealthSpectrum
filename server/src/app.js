import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
<<<<<<< HEAD
import geminiRoutes from "./routes/gemini.routes.js";

const app = express();

// CORS configuration for both development and production
=======

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

>>>>>>> 865491177bfdc8a2790e316593037a51c94f510c
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8080",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "https://health-spectrum.vercel.app",
    "https://healthspectrum.vercel.app",
    "https://health-spectrum-git-main.vercel.app",
    "https://health-spectrum-git-rishav.vercel.app",
    process.env.CLIENT_BASE_URL,
    process.env.FRONTEND_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
].filter(Boolean);

app.use(
    cors({
        origin: function (origin, callback) {
            console.log("🔍 CORS Request from origin:", origin);
            console.log("✅ Allowed origins:", allowedOrigins);

            // Always allow requests (for debugging)
            callback(null, true);
        },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Pragma",
            "Cache-Control",
            "Expires",
            "X-Requested-With",
            "Accept",
            "Origin",
        ],
        credentials: false, // Set to false when allowing all origins
        optionsSuccessStatus: 204,
    })
);

<<<<<<< HEAD
// Additional manual CORS headers (fallback)
=======
>>>>>>> 865491177bfdc8a2790e316593037a51c94f510c
app.use((req, res, next) => {
    const origin = req.headers.origin;
    res.header("Access-Control-Allow-Origin", origin || "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, Pragma"
    );

    if (req.method === "OPTIONS") {
        console.log("🔧 Handling OPTIONS preflight request from:", origin);
        return res.status(204).end();
    }

    next();
});

<<<<<<< HEAD
// Security middleware
app.use(
    helmet({
        crossOriginEmbedderPolicy: false, // Allow file uploads
        contentSecurityPolicy: false, // Disable for development
    })
);

// CORS middleware
// app.use(
//     cors({
//         origin: function (origin, callback) {
//             if (process.env.NODE_ENV === "production") {
//                 // Allow only specific origins in production
//                 if (!origin)
//                     return callback(new Error("Not allowed by CORS"), false);
//                 if (allowedOrigins.includes(origin)) {
//                     callback(null, true);
//                 } else {
//                     callback(new Error("Not allowed by CORS"));
//                 }
//             } else {
//                 // Allow all origins in development
//                 callback(null, true);
//             }
//         },
//         allowedHeaders: [
//             "Content-Type",
//             "Pragma",
//             "Cache-Control",
//             "Authorization",
//             "Expires",
//             "X-Requested-With",
//         ],
//         credentials: true,
//         methods: ["GET", "DELETE", "POST", "PUT", "PATCH", "OPTIONS"],
//         optionsSuccessStatus: 200,
//     })
// );

// Body parsing middleware
=======
app.use(helmet());

>>>>>>> 865491177bfdc8a2790e316593037a51c94f510c
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

<<<<<<< HEAD
// Health check route
app.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "HealthSpectrum API Server is running",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use("/api", geminiRoutes);

// 404 handler for undefined routes - must be last
app.use(function (req, res, next) {
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

=======
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
>>>>>>> 865491177bfdc8a2790e316593037a51c94f510c
// Global error handler
app.use((err, req, res, next) => {
    console.error("Global error handler:", err);

    // Multer file upload errors
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            error: "File too large",
            message: "File size exceeds 50MB limit",
        });
    }

    // Default error response
    res.status(err.status || 500).json({
        error: err.message || "Internal server error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
});

<<<<<<< HEAD
export { app };
=======
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
>>>>>>> 865491177bfdc8a2790e316593037a51c94f510c
