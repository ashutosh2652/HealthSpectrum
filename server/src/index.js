import app from "./app.js";  
import { connectdb, disconnectdb } from "./db/index.js";
import dotenv from "dotenv"
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
    app.on("error", (error) => {
      console.error("Error!!", error);
      throw error;
    });

    server = app.listen(process.env.PORT || 5000, () => {
      console.log(
        `✅ Server running on port: ${process.env.PORT || 5000}`
      );
    });
  })
  .catch((error) => {
    console.error("❌ MONGODB failed to connect!!!", error);
    process.exit(1);
  });

["SIGTERM", "SIGINT"].forEach((sig) =>
  process.on(sig, async () => {
    console.info(`Caught ${sig}, draining...`);
    await disconnectdb();
    server.close(() => process.exit(0));
  })
);
