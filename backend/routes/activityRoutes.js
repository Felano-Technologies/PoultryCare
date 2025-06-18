import express from 'express';
import {
  getRecentActivities,
  logActivity,
  getActivitiesByType
} from '../controllers/activityController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getRecentActivities);
router.post('/', authMiddleware, logActivity);
router.get('/:type', authMiddleware, getActivitiesByType);

export default router;