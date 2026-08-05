import express from 'express';
import { loginAdmin, verifyAdminStatus } from '../controllers/authController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/verify', requireAdmin, verifyAdminStatus);

export default router;
