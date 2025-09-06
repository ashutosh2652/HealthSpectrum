import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

import documentRoutes from "./routes/documentRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// Correct whitelist usage (remove extra bracket and fix variable name)
const whitelist = [process.env.FRONTEND_URL || "http://localhost:5173"];

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like Postman)
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    allowedHeaders: [
      "Content-Type",
      "Pragma",
      "Cache-Control",
      "Authorization",
      "Expires",
    ],
    credentials: true,
    methods: ["GET", "DELETE", "POST", "PUT", "PATCH"],
  })
);

// Fix cookieParser usage (should be called as a function)
app.use(cookieParser());

// Body parser
app.use(express.json());

// Correct routes (add leading slash)
app.use("/api/documents", documentRoutes);
app.use("/api/users", userRoutes);

export { app };
