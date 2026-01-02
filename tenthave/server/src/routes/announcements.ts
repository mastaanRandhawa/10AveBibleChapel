import express from 'express';
import {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcementController';

const router: express.Router = express.Router();

// GET /api/announcements - Get all announcements (with optional filters)
router.get('/', getAnnouncements);

// GET /api/announcements/:id - Get a specific announcement
router.get('/:id', getAnnouncement);

// POST /api/announcements - Create a new announcement
router.post('/', createAnnouncement);

// PUT /api/announcements/:id - Update an announcement
router.put('/:id', updateAnnouncement);

// DELETE /api/announcements/:id - Delete an announcement
router.delete('/:id', deleteAnnouncement);

export default router;

