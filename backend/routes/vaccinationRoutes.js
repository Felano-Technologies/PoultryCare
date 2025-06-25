import express from 'express';
import { createVaccination, getVaccinations, getVaccinationStats, getVaccinationChartData, getNextVaccination,
    deleteVaccination,
    updateVaccination,
    exportVaccinations
} from '../controllers/vaccinationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createVaccination);
router.get('/', authMiddleware, getVaccinations);
router.get('/stats', authMiddleware, getVaccinationStats);
router.get('/chart', authMiddleware, getVaccinationChartData);
router.get('/next', authMiddleware, getNextVaccination);
router.delete('/:id', authMiddleware, deleteVaccination);
router.put('/:id', authMiddleware, updateVaccination);
router.get('/export', authMiddleware, exportVaccinations);

export default router;
