import express from "express";
import {
  getPrayerRequests,
  getPrayerRequest,
  createPrayerRequest,
  updatePrayerRequest,
  deletePrayerRequest,
} from "../controllers/prayerRequestController";
import {
  authenticateToken,
  requireAdmin,
  requireMemberOrAdmin,
} from "../middleware/auth";

const router: express.Router = express.Router();

// GET /api/prayer-requests - Get all prayer requests - MEMBERS & ADMINS ONLY
router.get("/", authenticateToken, requireMemberOrAdmin, getPrayerRequests);

// GET /api/prayer-requests/:id - Get a specific prayer request - MEMBERS & ADMINS ONLY
router.get("/:id", authenticateToken, requireMemberOrAdmin, getPrayerRequest);

// POST /api/prayer-requests - Create a new prayer request - PUBLIC (anyone can submit)
router.post("/", createPrayerRequest);

// PUT /api/prayer-requests/:id - Update a prayer request - ADMIN ONLY (for status updates, moderation)
router.put("/:id", authenticateToken, requireAdmin, updatePrayerRequest);

// DELETE /api/prayer-requests/:id - Delete a prayer request - ADMIN ONLY
router.delete("/:id", authenticateToken, requireAdmin, deletePrayerRequest);

export default router;
