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
router.post('/', createProfessor);

// Rutas que solo requieren autenticación
router.get('/:id', getProfessor); // Obtener profesor por ID
router.get('/career/:careerId', getProfessorsByCareer); // Obtener profesores por carrera
router.get('/class/:classId', getProfessorsByClass); // Obtener profesores por clase

export default router;
