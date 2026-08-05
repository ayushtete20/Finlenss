import express from 'express';
import {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  trackSiteVisit,
  trackArticleClick,
  getSiteStats,
  toggleTrending,
  getAllCategories,
  createCategory,
  deleteCategory
} from '../controllers/articleController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllArticles);
router.get('/categories/all', getAllCategories);
router.post('/track-visit', trackSiteVisit);
router.get('/stats/summary', getSiteStats);
router.post('/:id/click', trackArticleClick);
router.get('/:id', getArticleById);

// Admin protected routes
router.post('/categories', requireAdmin, createCategory);
router.delete('/categories/:id', requireAdmin, deleteCategory);
router.post('/', requireAdmin, createArticle);
router.put('/:id/trending', requireAdmin, toggleTrending);
router.put('/:id', requireAdmin, updateArticle);
router.delete('/:id', requireAdmin, deleteArticle);

export default router;
