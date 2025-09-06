import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import analysisRoutes from "./routes/Analysis.routes.js";

const app = express();

// Allow both ports for development
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:8080",
    "http://localhost:3000",
    process.env.CLIENT_BASE_URL,
].filter(Boolean);

app.use(helmet());
app.use(
    cors({
        origin: allowedOrigins,
        allowedHeaders: [
            "Content-Type",
            "Pragma",
            "Cache-Control",
            "Authorization",
            "Expires",
        ],
        credentials: true,
        methods: ["GET", "DELETE", "POST", "PUT", "PATCH", "OPTIONS"],
        optionsSuccessStatus: 200,
    })
);

// Handle preflight requests
app.options("*", cors());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", analysisRoutes);

export { app };
