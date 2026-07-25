import http from "http";
import dotenv from "dotenv";

import app from "./app.js";
import { initializeSocket } from "./sockets/index.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);

initializeSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});