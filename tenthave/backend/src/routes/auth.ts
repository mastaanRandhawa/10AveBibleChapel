import express from "express";
import { register, login, getCurrentUser } from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";

const router: express.Router = express.Router();

// POST /api/auth/register - Register a new user
router.post("/register", register);

// POST /api/auth/login - Login user
router.post("/login", login);

// GET /api/auth/me - Get current user (requires authentication)
router.get("/me", authenticateToken, getCurrentUser);

export default router;

