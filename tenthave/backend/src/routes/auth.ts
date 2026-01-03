import express from "express";
import { register, login, getCurrentUser, updateCurrentUser } from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";

const router: express.Router = express.Router();

// POST /api/auth/register - Register a new user
router.post("/register", register);

// POST /api/auth/login - Login user
router.post("/login", login);

// GET /api/auth/me - Get current user (requires authentication)
router.get("/me", authenticateToken, getCurrentUser);

// PATCH /api/auth/me - Update current user profile (requires authentication)
router.patch("/me", authenticateToken, updateCurrentUser);

export default router;

