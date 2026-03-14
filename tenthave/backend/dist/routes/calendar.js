"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const calendarController_1 = require("../controllers/calendarController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// GET /api/calendar - Get all calendar events (with optional filters) - PUBLIC
router.get("/", calendarController_1.getCalendarEvents);
// GET /api/calendar/:id - Get a specific calendar event - PUBLIC
router.get("/:id", calendarController_1.getCalendarEvent);
// POST /api/calendar - Create a new calendar event - ADMIN ONLY
router.post("/", auth_1.authenticateToken, auth_1.requireAdmin, calendarController_1.createCalendarEvent);
// PUT /api/calendar/:id - Update a calendar event - ADMIN ONLY
router.put("/:id", auth_1.authenticateToken, auth_1.requireAdmin, calendarController_1.updateCalendarEvent);
// DELETE /api/calendar/:id - Delete a calendar event - ADMIN ONLY
router.delete("/:id", auth_1.authenticateToken, auth_1.requireAdmin, calendarController_1.deleteCalendarEvent);
exports.default = router;
//# sourceMappingURL=calendar.js.map