import express from "express";
import {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController";
import { authenticateToken, requireAdmin } from "../middleware/auth";

const router: express.Router = express.Router();

// GET /api/announcements - Get all announcements (with optional filters) - PUBLIC
router.get("/", getAnnouncements);

// GET /api/announcements/:id - Get a specific announcement - PUBLIC
router.get("/:id", getAnnouncement);

// POST /api/announcements - Create a new announcement - ADMIN ONLY
router.post("/", authenticateToken, requireAdmin, createAnnouncement);

// PUT /api/announcements/:id - Update an announcement - ADMIN ONLY
router.put("/:id", authenticateToken, requireAdmin, updateAnnouncement);

// DELETE /api/announcements/:id - Delete an announcement - ADMIN ONLY
router.delete("/:id", authenticateToken, requireAdmin, deleteAnnouncement);

export default router;
