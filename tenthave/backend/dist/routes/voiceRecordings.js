"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const voiceRecordingController_1 = require("../controllers/voiceRecordingController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// GET /api/voice-recordings - Get all recordings (with optional filters) - PUBLIC
router.get("/", voiceRecordingController_1.getVoiceRecordings);
// GET /api/voice-recordings/:id - Get a specific recording - PUBLIC
router.get("/:id", voiceRecordingController_1.getVoiceRecording);
// POST /api/voice-recordings - Create a recording - ADMIN ONLY
router.post("/", auth_1.authenticateToken, auth_1.requireAdmin, voiceRecordingController_1.createVoiceRecording);
// PUT /api/voice-recordings/:id - Update a recording - ADMIN ONLY
router.put("/:id", auth_1.authenticateToken, auth_1.requireAdmin, voiceRecordingController_1.updateVoiceRecording);
// DELETE /api/voice-recordings/:id - Delete a recording - ADMIN ONLY
router.delete("/:id", auth_1.authenticateToken, auth_1.requireAdmin, voiceRecordingController_1.deleteVoiceRecording);
exports.default = router;
//# sourceMappingURL=voiceRecordings.js.map