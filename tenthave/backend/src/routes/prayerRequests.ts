import express from "express";
import {
  getPrayerRequests,
  getPrayerRequest,
  createPrayerRequest,
  updatePrayerRequest,
  deletePrayerRequest,
} from "../controllers/prayerRequestController";

const router: express.Router = express.Router();

// GET /api/prayer-requests - Get all prayer requests (with optional filters)
router.get("/", getPrayerRequests);

// GET /api/prayer-requests/:id - Get a specific prayer request
router.get("/:id", getPrayerRequest);

// POST /api/prayer-requests - Create a new prayer request
router.post("/", createPrayerRequest);

// PUT /api/prayer-requests/:id - Update a prayer request
router.put("/:id", updatePrayerRequest);

// DELETE /api/prayer-requests/:id - Delete a prayer request
router.delete("/:id", deletePrayerRequest);

export default router;
