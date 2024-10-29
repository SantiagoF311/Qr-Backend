import express from 'express';
import { authenticateUser, isAdmin } from '../../authMiddleware.js';
import {
  createStudent,
  getStudentsByCareer,
  getStudentsByClass,
} from '../../controllers/person/studentController.js';

const router = express.Router();

// Rutas que requieren autenticación y permisos de admin
router.post('/', authenticateUser, isAdmin, createStudent);

// Rutas que solo requieren autenticación
router.get('/career/:careerId', authenticateUser, getStudentsByCareer);
router.get('/class/:classId', authenticateUser, getStudentsByClass);

export default router;
