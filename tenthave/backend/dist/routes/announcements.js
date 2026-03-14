"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const announcementController_1 = require("../controllers/announcementController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// GET /api/announcements - Get all announcements (with optional filters) - PUBLIC
router.get("/", announcementController_1.getAnnouncements);
// GET /api/announcements/:id - Get a specific announcement - PUBLIC
router.get("/:id", announcementController_1.getAnnouncement);
// POST /api/announcements - Create a new announcement - ADMIN ONLY
router.post("/", auth_1.authenticateToken, auth_1.requireAdmin, announcementController_1.createAnnouncement);
// PUT /api/announcements/:id - Update an announcement - ADMIN ONLY
router.put("/:id", auth_1.authenticateToken, auth_1.requireAdmin, announcementController_1.updateAnnouncement);
// DELETE /api/announcements/:id - Delete an announcement - ADMIN ONLY
router.delete("/:id", auth_1.authenticateToken, auth_1.requireAdmin, announcementController_1.deleteAnnouncement);
exports.default = router;
//# sourceMappingURL=announcements.js.map