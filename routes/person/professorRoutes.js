import express from 'express';
import { authenticateUser, isAdmin } from '../../authMiddleware.js';
import {
  createProfessor,
  getProfessorsByCareer,
  getProfessorsByClass,
} from '../../controllers/person/professorController.js';

const router = express.Router();

// Rutas que requieren autenticación y permisos de admin
router.post('/', authenticateUser, isAdmin, createProfessor);

// Rutas que solo requieren autenticación
router.get('/career/:careerId', authenticateUser, getProfessorsByCareer);
router.get('/class/:classId', authenticateUser, getProfessorsByClass);

export default router;
