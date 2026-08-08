import express from 'express';
import {
  createFeedback,
  getFeedback,
  deleteFeedback
} from '../controllers/feedbackController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public feedback submit route
router.post('/feedback', createFeedback);

// Protected admin reader feedback management routes
router.get('/admin/feedback', requireAdmin, getFeedback);
router.delete('/admin/feedback/:id', requireAdmin, deleteFeedback);

export default router;
