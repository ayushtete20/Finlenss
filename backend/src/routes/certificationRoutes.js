import express from 'express';
import {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification
} from '../controllers/certificationController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to view certifications
router.get('/certifications', getCertifications);

// Admin certification management
router.post('/admin/certifications', requireAdmin, createCertification);
router.put('/admin/certifications/:id', requireAdmin, updateCertification);
router.delete('/admin/certifications/:id', requireAdmin, deleteCertification);

export default router;
