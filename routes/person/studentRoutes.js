import express from 'express';
import { authenticateUser, isAdmin } from '../../authMiddleware.js';
import {
  createStudent,
  getStudent, 
  getStudentsByCareer,
  getStudentsByClass,
} from '../../controllers/person/studentController.js';

const router = express.Router();

// Rutas que requieren autenticación y permisos de admin
router.post('/', authenticateUser, isAdmin, createStudent);

// Rutas que solo requieren autenticación
router.get('/:id', authenticateUser, getStudent); // Obtener un estudiante específico
router.get('/career/:careerId', authenticateUser, getStudentsByCareer); // Obtener estudiantes por carrera
router.get('/class/:classId', authenticateUser, getStudentsByClass); // Obtener estudiantes por clase

export default router;
