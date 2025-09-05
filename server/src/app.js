import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const whitelist = [process.env.CLIENT_BASE_URL];

app.use(helmet());
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin)
                return callback(new Error("Origin Header is required!"), false);
            if (whitelist.includes(origin)) {
                return callback(null, true);
            } else {
                return callback(
                    new Error(
                        "Blocked by cors origin. You are not allowed to access this!"
                    ),
                    false
                );
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
app.use(cookieParser);
app.use(express.json());

export { app };
