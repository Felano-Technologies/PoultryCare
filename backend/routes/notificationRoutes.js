import express from 'express';
import {
  getNotifications,
  createNotification,
  markAsRead
} from '../controllers/notificationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getNotifications);
router.post('/', authMiddleware, createNotification);
router.patch('/:id/read', authMiddleware, markAsRead);

export default router;