import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import { initializeSocket } from "./sockets/index.js";
import { connectDatabase } from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);

initializeSocket(httpServer);

const startServer = async () => {
  try {
    await connectDatabase();

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
