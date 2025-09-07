import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import analysisRoutes from "./routes/Analysis.routes.js";
import { User } from "./models/User.js";
import { ClerkWebhookHandler } from "./controllers/Clerk.controllers.js";
import { requireAuth } from "@clerk/express"; // Protect routes
// import { clerkClient } from "@clerk/backend"; // Server SDK

dotenv.config();

const app = express();

// Allowed origins
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://health-spectrum.vercel.app",
    "https://healthspectrum.vercel.app",
    process.env.CLIENT_BASE_URL,
    process.env.FRONTEND_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
].filter(Boolean);

// CORS middleware
app.use(
    cors({
        origin: function (origin, callback) {
            console.log("🔍 CORS Request from origin:", origin);
            callback(null, true); // Allow all origins (for debugging)
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
        credentials: false,
        optionsSuccessStatus: 204,
    })
);

// Manual CORS headers fallback
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

    if (req.method === "OPTIONS") return res.status(204).end();
    next();
});

// Security middleware
app.use(
    helmet({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: false,
    })
);

// Body parsing middleware
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Webhook raw body middleware
app.use("/api/webhooks/clerk", bodyParser.raw({ type: "application/json" }));

// Health check
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

// API routes
app.use("/api", analysisRoutes);

// Clerk webhook endpoint
app.post("/api/webhooks/clerk", (req, res) => {
    // Attach rawBody for signature verification
    req.rawBody = req.body.toString();
    ClerkWebhookHandler(req, res);
});

// Session setup
app.use(
    session({
        secret: process.env.SESSION_SECRET || "change_me",
        resave: false,
        saveUninitialized: false,
    })
);

// Sign-in endpoint (demo)
app.post("/auth/login", async (req, res) => {
    const { userId } = req.body; // Clerk userId from frontend
    req.session.clerkId = userId;
    res.sendStatus(200);
});

// Logout endpoint
// app.post("/auth/logout", (req, res) => {
//     req.session.destroy((err) => {
//         res.sendStatus(err ? 500 : 200);
//     });
// });
app.post("/auth/logout", requireAuth(), async (req, res) => {
    try {
        // Destroy Express session
        req.session.destroy((err) => {
            if (err) console.error("Session destroy error:", err);
        });

        // Revoke Clerk session
        const sessionId = req.auth.sessionId; // from Clerk
        if (sessionId) {
            await clerkClient.sessions.revokeSession(sessionId);
        }

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ error: "Logout failed" });
    }
});

// Protected route for fetching user data
app.get("/api/user", requireAuth(), async (req, res) => {
    const userId = req.auth.userId;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
        clerkId: user.clerkId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        imageUrl: user.imageUrl,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found",
        message: `Cannot ${req.method} ${req.originalUrl}`,
        availableEndpoints: ["GET /", "GET /health", "POST /api/analyze"],
    });
});

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

export { app };
