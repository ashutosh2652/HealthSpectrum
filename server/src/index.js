import { app } from "./app.js";
import { connectdb, disconnectdb } from "./db/index.js";

let server;

// Try to connect to MongoDB, but don't fail if it's not available
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

    const PORT = process.env.PORT || 5000;
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
