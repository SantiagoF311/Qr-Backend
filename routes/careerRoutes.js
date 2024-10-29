import express from 'express';
import { authenticateUser, isAdmin } from '../authMiddleware.js';
import {
  createCareer,
  getAllCareers,
  getCareerById,
  updateCareer,
  deleteCareer,
  deleteAllCareers
} from '../controllers/careerController.js';

const router = express.Router();

// Rutas que requieren autenticación y ser admin
router.post('/', authenticateUser, isAdmin, createCareer);
router.put('/:id', authenticateUser, isAdmin, updateCareer);
router.delete('/', authenticateUser, isAdmin, deleteAllCareers);
router.delete('/:id', authenticateUser, isAdmin, deleteCareer);

// Rutas que requieren solo autenticación
router.get('/', authenticateUser, getAllCareers);
router.get('/:id', authenticateUser, getCareerById);

export default router;
