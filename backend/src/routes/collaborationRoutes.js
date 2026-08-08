import express from 'express';
import {
  createCollaboration,
  getCollaborations,
  updateCollaborationStatus,
  deleteCollaboration
} from '../controllers/collaborationController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public collaboration submit route
router.post('/collaborations', createCollaboration);

// Protected admin collaboration management routes
router.get('/admin/collaborations', requireAdmin, getCollaborations);
router.patch('/admin/collaborations/:id/status', requireAdmin, updateCollaborationStatus);
router.delete('/admin/collaborations/:id', requireAdmin, deleteCollaboration);

export default router;
