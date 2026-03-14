import express from "express";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserApproval,
} from "../controllers/userController";
import { authenticateToken, requireAdmin } from "../middleware/auth";

const router: express.Router = express.Router();

// All user management routes require admin access
router.use(authenticateToken, requireAdmin);

// GET /api/users - Get all users
router.get("/", getUsers);

// GET /api/users/:id - Get a specific user
router.get("/:id", getUser);

// PUT /api/users/:id - Update user
router.put("/:id", updateUser);

// PATCH /api/users/:id/approval - Update user approval status
router.patch("/:id/approval", updateUserApproval);

// DELETE /api/users/:id - Delete user
router.delete("/:id", deleteUser);

export default router;

