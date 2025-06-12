import express from 'express';
import { askGemini } from '../controllers/aiController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/ask', authMiddleware, askGemini);

export default router;
