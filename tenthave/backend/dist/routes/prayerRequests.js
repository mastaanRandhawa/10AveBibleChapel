"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prayerRequestController_1 = require("../controllers/prayerRequestController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// GET /api/prayer-requests - Get all prayer requests - APPROVED USERS & ADMINS ONLY
router.get("/", auth_1.authenticateToken, auth_1.requireApprovedUser, prayerRequestController_1.getPrayerRequests);
// GET /api/prayer-requests/:id - Get a specific prayer request - APPROVED USERS & ADMINS ONLY
router.get("/:id", auth_1.authenticateToken, auth_1.requireApprovedUser, prayerRequestController_1.getPrayerRequest);
// POST /api/prayer-requests - Create a new prayer request - PUBLIC (anyone can submit)
router.post("/", prayerRequestController_1.createPrayerRequest);
// PUT /api/prayer-requests/:id - Update a prayer request - ADMIN ONLY (for moderation)
router.put("/:id", auth_1.authenticateToken, auth_1.requireAdmin, prayerRequestController_1.updatePrayerRequest);
// DELETE /api/prayer-requests/:id - Delete a prayer request - ADMIN ONLY
router.delete("/:id", auth_1.authenticateToken, auth_1.requireAdmin, prayerRequestController_1.deletePrayerRequest);
exports.default = router;
//# sourceMappingURL=prayerRequests.js.map