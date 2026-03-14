"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sermonController_1 = require("../controllers/sermonController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// GET /api/sermons - Get all sermons (with optional filters) - PUBLIC
router.get("/", sermonController_1.getSermons);
// GET /api/sermons/series/:seriesName - Get sermons by series - PUBLIC
router.get("/series/:seriesName", sermonController_1.getSermonsBySeries);
// GET /api/sermons/:id - Get a specific sermon - PUBLIC
router.get("/:id", sermonController_1.getSermon);
// POST /api/sermons - Create a new sermon - ADMIN ONLY
router.post("/", auth_1.authenticateToken, auth_1.requireAdmin, sermonController_1.createSermon);
// PUT /api/sermons/:id - Update a sermon - ADMIN ONLY
router.put("/:id", auth_1.authenticateToken, auth_1.requireAdmin, sermonController_1.updateSermon);
// DELETE /api/sermons/:id - Delete a sermon - ADMIN ONLY
router.delete("/:id", auth_1.authenticateToken, auth_1.requireAdmin, sermonController_1.deleteSermon);
exports.default = router;
//# sourceMappingURL=sermons.js.map