import express from 'express';
import { authenticateUser, isAdmin } from '../authMiddleware.js';
import {
  createSemester,
  deleteAllSemesters,
  deleteSemester,
  getAllSemesters
} from '../controllers/semesterController.js';

const router = express.Router();

// Rutas que requieren autenticación y ser admin
router.post('/', authenticateUser, isAdmin, createSemester);
router.delete('/', authenticateUser, isAdmin, deleteAllSemesters);
router.delete('/:id', authenticateUser, isAdmin, deleteSemester);

// Rutas que requieren solo autenticación
router.get('/', authenticateUser, getAllSemesters);

export default router;
