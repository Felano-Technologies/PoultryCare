import express from 'express';
import { createVaccination, getVaccinations, getVaccinationStats, getVaccinationChartData, getNextVaccination } from '../controllers/vaccinationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createVaccination);
router.get('/', authMiddleware, getVaccinations);
router.get('/stats', authMiddleware, getVaccinationStats);
router.get('/chart', authMiddleware, getVaccinationChartData);
router.get('/next', authMiddleware, getNextVaccination);


export default router;
