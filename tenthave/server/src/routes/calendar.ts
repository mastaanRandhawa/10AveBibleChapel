import express from "express";
import {
  getCalendarEvents,
  getCalendarEvent,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "../controllers/calendarController";

const router: express.Router = express.Router();

// GET /api/calendar - Get all calendar events (with optional filters)
router.get("/", getCalendarEvents);

// GET /api/calendar/:id - Get a specific calendar event
router.get("/:id", getCalendarEvent);

// POST /api/calendar - Create a new calendar event
router.post("/", createCalendarEvent);

// PUT /api/calendar/:id - Update a calendar event
router.put("/:id", updateCalendarEvent);

// DELETE /api/calendar/:id - Delete a calendar event
router.delete("/:id", deleteCalendarEvent);

export default router;
