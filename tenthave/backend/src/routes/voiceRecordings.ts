import express from "express";
import {
  getVoiceRecordings,
  getVoiceRecording,
  createVoiceRecording,
  updateVoiceRecording,
  deleteVoiceRecording,
} from "../controllers/voiceRecordingController";
import { authenticateToken, requireAdmin } from "../middleware/auth";

const router: express.Router = express.Router();

// GET /api/voice-recordings - Get all recordings (with optional filters) - PUBLIC
router.get("/", getVoiceRecordings);

// GET /api/voice-recordings/:id - Get a specific recording - PUBLIC
router.get("/:id", getVoiceRecording);

// POST /api/voice-recordings - Create a recording - ADMIN ONLY
router.post("/", authenticateToken, requireAdmin, createVoiceRecording);

// PUT /api/voice-recordings/:id - Update a recording - ADMIN ONLY
router.put("/:id", authenticateToken, requireAdmin, updateVoiceRecording);

// DELETE /api/voice-recordings/:id - Delete a recording - ADMIN ONLY
router.delete("/:id", authenticateToken, requireAdmin, deleteVoiceRecording);

export default router;
