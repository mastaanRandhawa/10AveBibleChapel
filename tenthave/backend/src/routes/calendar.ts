import express from "express";
import {
  getCalendarEvents,
  getCalendarEvent,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "../controllers/calendarController";
import { authenticateToken, requireAdmin } from "../middleware/auth";

const router: express.Router = express.Router();

// GET /api/calendar - Get all calendar events (with optional filters) - PUBLIC
router.get("/", getCalendarEvents);

// GET /api/calendar/:id - Get a specific calendar event - PUBLIC
router.get("/:id", getCalendarEvent);

// POST /api/calendar - Create a new calendar event - ADMIN ONLY
router.post("/", authenticateToken, requireAdmin, createCalendarEvent);

// PUT /api/calendar/:id - Update a calendar event - ADMIN ONLY
router.put("/:id", authenticateToken, requireAdmin, updateCalendarEvent);

// DELETE /api/calendar/:id - Delete a calendar event - ADMIN ONLY
router.delete("/:id", authenticateToken, requireAdmin, deleteCalendarEvent);

export default router;
