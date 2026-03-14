import express from "express";
import {
  getSermons,
  getSermon,
  getSermonsBySeries,
  createSermon,
  updateSermon,
  deleteSermon,
} from "../controllers/sermonController";
import { authenticateToken, requireAdmin } from "../middleware/auth";

const router: express.Router = express.Router();

// GET /api/sermons - Get all sermons (with optional filters) - PUBLIC
router.get("/", getSermons);

// GET /api/sermons/series/:seriesName - Get sermons by series - PUBLIC
router.get("/series/:seriesName", getSermonsBySeries);

// GET /api/sermons/:id - Get a specific sermon - PUBLIC
router.get("/:id", getSermon);

// POST /api/sermons - Create a new sermon - ADMIN ONLY
router.post("/", authenticateToken, requireAdmin, createSermon);

// PUT /api/sermons/:id - Update a sermon - ADMIN ONLY
router.put("/:id", authenticateToken, requireAdmin, updateSermon);

// DELETE /api/sermons/:id - Delete a sermon - ADMIN ONLY
router.delete("/:id", authenticateToken, requireAdmin, deleteSermon);

export default router;

