import express from 'express';
import {
  getVisitors,
  createVisitor,
} from '../controllers/visitorController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/get', authMiddleware, getVisitors);
router.post('/add', authMiddleware, createVisitor);

export default router;