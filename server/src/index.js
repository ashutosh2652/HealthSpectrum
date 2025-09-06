import { app } from "./app.js";
import { connectdb, disconnectdb } from "./db/index.js";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 5000;
let server;

connectdb()
  .then(() => {
    app.on("error", (error) => {
      console.error("❌ Express error:", error);
      throw error;
    });

    server = app.listen(PORT, () => {
      console.log(`✅ MongoDB connected & server running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB failed to connect!!!", error);
    process.exit(1);
  });

["SIGTERM", "SIGINT"].forEach((sig) =>
  process.on(sig, async () => {
    console.info(`⚠️ Caught ${sig}, draining...`);
    await disconnectdb();
    if (server) {
      server.close(() => process.exit(0));
    } else {
      process.exit(0);
    }
  })
);
