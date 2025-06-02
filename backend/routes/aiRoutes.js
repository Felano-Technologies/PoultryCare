import express from 'express';
import upload from '../middleware/multer.js';
import { handleAIQuestion } from '../controllers/aiController.js';
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ error: 'Image upload failed' });
  }
  return res.status(200).json({ imageUrl: req.file.path });
});

router.post('/ask', authMiddleware, handleAIQuestion);

export default router;




