import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import analysisRoutes from "./routes/Analysis.routes.js";

const app = express();

// CORS configuration for both development and production
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
        origin: "*",
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
        credentials: true,
        optionsSuccessStatus: 204,
    })
);

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
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

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
app.use("/api", analysisRoutes);

// 404 handler for undefined routes - must be last
app.use(function (req, res, next) {
    res.status(404).json({
        error: "Route not found",
        message: `Cannot ${req.method} ${req.originalUrl}`,
        availableEndpoints: ["GET /", "GET /health", "POST /api/analyze"],
    });
});

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

export { app };
