import app from "./app.js";  
import { connectdb, disconnectdb } from "./db/index.js";

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
