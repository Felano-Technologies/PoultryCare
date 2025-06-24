import express from 'express';
import {
    getExpertsByRole,
    bookConsultation,
    getUserConsultations,
    handleChatMessage,
  } from '../controllers/consultationController.js';
  import authMiddleware  from '../middleware/authMiddleware.js';

const router = express.Router();


// Expert Consultation Routes
router.route('/experts')
  .get(getExpertsByRole);

router.route('/bookings')
  .post(authMiddleware, bookConsultation)
  .get(authMiddleware, getUserConsultations);

router.route('/chat')
  .post(handleChatMessage);

export default router;