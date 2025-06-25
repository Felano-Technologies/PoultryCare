// routes/aiRoutes.js
import express from 'express';
import { 
  askGemini, 
  getMessages, 
  getChats, 
  createChat, 
  deleteChat 
} from '../controllers/aiController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/ask', authMiddleware, askGemini);
router.get('/messages', authMiddleware, getMessages);
router.get('/chats', authMiddleware, getChats);
router.post('/chats', authMiddleware, createChat);
router.delete('/chats/:chatId', authMiddleware, deleteChat);

export default router;