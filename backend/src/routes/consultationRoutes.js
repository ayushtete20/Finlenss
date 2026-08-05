import express from 'express';
import {
  createConsultation,
  getConsultations,
  updateConsultationStatus,
  deleteConsultation
} from '../controllers/consultationController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public reservation route
router.post('/consultations', createConsultation);

// Protected admin lead management routes
router.get('/admin/consultations', requireAdmin, getConsultations);
router.patch('/admin/consultations/:id/status', requireAdmin, updateConsultationStatus);
router.delete('/admin/consultations/:id', requireAdmin, deleteConsultation);

export default router;
