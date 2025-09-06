import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const whitelist = [process.env.CLIENT_BASE_URL];

app.use(helmet());
app.use(
    cors({
        origin: "*",
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
app.use(cookieParser);
app.use(express.json());

export { app };
