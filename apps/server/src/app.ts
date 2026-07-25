import express, { type Application } from "express";
import cors from "cors";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Chat Server is running 🚀",
  });
});

export default app;