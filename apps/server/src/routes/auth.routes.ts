import { Router } from "express";
import { getCurrentUser, register } from "../controllers/auth.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/me", authenticateUser, getCurrentUser)
router.post("/register", register);

export default router;