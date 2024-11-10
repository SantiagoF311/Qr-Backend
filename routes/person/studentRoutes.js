import express from 'express';
import { authenticateUser, isAdmin } from '../../authMiddleware.js';
import {
  createStudent,
  getStudent, 
  getStudentsByCareer,
  getStudentsByClass,
  updateAttendance, 
} from '../../controllers/person/studentController.js';

const router = express.Router();

// Rutas que requieren autenticación y permisos de admin
router.post('/', createStudent);

// Rutas que solo requieren autenticación
router.get('/:id', getStudent); // Obtener un estudiante específico
router.get('/career/:careerId', getStudentsByCareer); // Obtener estudiantes por carrera
router.get('/class/:classId', getStudentsByClass); // Obtener estudiantes por clase

// Ruta para actualizar la asistencia
router.patch('/:id/attendance', updateAttendance);  // Aquí añadimos la ruta para actualizar la asistencia

export default router;
