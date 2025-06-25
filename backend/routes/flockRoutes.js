import express from 'express';
import { createFlock, getFlocksByFarm, getFlockStatusCounts, exportFlock, getFlockById, deleteFlock, getFarmStatistics, logFlockHealth, logFlockFeed, getFeedConsumptionStats } from '../controllers/FlockController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createFlock);
router.get('/', authMiddleware, getFlocksByFarm);
router.get('/chart/status', authMiddleware, getFlockStatusCounts);
router.get('/feed/status', authMiddleware, getFeedConsumptionStats);
router.get('/farm/stats', authMiddleware, getFarmStatistics);
router.get('/:id', authMiddleware, getFlockById);
router.post('/:id/health-log', authMiddleware, logFlockHealth);
router.post('/:id/feed-log', authMiddleware, logFlockFeed);
router.delete('/:id', authMiddleware, deleteFlock);
router.get('/export/:id', authMiddleware, exportFlock)

export default router;
