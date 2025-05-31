import express from 'express';
import { createFlock, getFlocksByFarm, getFlockStatusCounts, getFlockById, logFlockHealth, logFlockFeed } from '../controllers/FlockController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createFlock);
router.get('/', authMiddleware, getFlocksByFarm);
router.get('/chart/status', authMiddleware, getFlockStatusCounts);
router.get('/:id', authMiddleware, getFlockById);
router.post('/:id/health-log', authMiddleware, logFlockHealth);
router.post('/:id/feed-log', authMiddleware, logFlockFeed);

export default router;
