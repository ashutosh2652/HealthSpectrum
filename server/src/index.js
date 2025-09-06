import dotenv from "dotenv";
import { app } from "./app.js";
import { connectdb, disconnectdb } from "./db/index.js";

// Load environment variables
dotenv.config();

// Debug environment variables
console.log("🔧 Environment variables loaded:");
console.log("- PORT:", process.env.PORT);
console.log("- NODE_ENV:", process.env.NODE_ENV);
console.log("- CLIENT_BASE_URL:", process.env.CLIENT_BASE_URL);
console.log("- FRONTEND_URL:", process.env.FRONTEND_URL);
console.log(
    "- LANDING_AI_API_KEY:",
    process.env.LANDING_AI_API_KEY ? "✅ Loaded" : "❌ Missing"
);

const PORT = process.env.PORT || 5000;
let server;

connectdb()
    .then(() => {
        console.log("✅ MongoDB connected successfully");
        startServer();
    })
    .catch((error) => {
        console.log(
            "⚠️ MongoDB connection failed, but starting server anyway:",
            error.message
        );
        console.log(
            "🚀 Server will work without database for LandingAI testing"
        );
        startServer();
    });

function startServer() {
    app.on("error", (error) => {
        console.log("❌ App Error:", error);
        throw error;
    });

    server = app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📡 API endpoint: http://localhost:${PORT}/api/analyze`);
    });
}

["SIGTERM", "SIGINT"].forEach((sig) =>
    process.on(sig, async () => {
        console.info(`Caught ${sig} draining...`);
        try {
            await disconnectdb();
        } catch (error) {
            console.log("MongoDB disconnect error (ignoring):", error.message);
        }
        server.close(() => process.exit(0));
    })
);
