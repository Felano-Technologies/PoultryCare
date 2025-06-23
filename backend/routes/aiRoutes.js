import express from 'express';
import { askGemini, getMessages } from '../controllers/aiController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/ask', authMiddleware, askGemini);
router.get('/messages', authMiddleware, getMessages);

export default router;
