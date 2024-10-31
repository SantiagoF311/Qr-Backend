import express from 'express';
import { authenticateUser, isAdmin } from '../../authMiddleware.js';
import {
  createProfessor,
  getProfessor,
  getProfessorsByCareer,
  getProfessorsByClass,
} from '../../controllers/person/professorController.js';

const router = express.Router();

// Rutas que requieren autenticación y permisos de admin
router.post('/', authenticateUser, isAdmin, createProfessor);

// Rutas que solo requieren autenticación
router.get('/:id', authenticateUser, getProfessor); // Obtener profesor por ID
router.get('/career/:careerId', authenticateUser, getProfessorsByCareer); // Obtener profesores por carrera
router.get('/class/:classId', authenticateUser, getProfessorsByClass); // Obtener profesores por clase

export default router;
