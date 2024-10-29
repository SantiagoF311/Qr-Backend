import express from 'express';
import { authenticateUser, isAdmin } from '../../authMiddleware.js';
import {
  createClass,
  getAllClasses,
  getClassById,
  getClassesBySemester,
  getClassesByCareer,
  updateClass,
  deleteAllClasses,
  deleteClass,
} from '../controllers/classController.js';

const router = express.Router();

// Rutas que requieren autenticación y permisos de admin
router.post('/', authenticateUser, isAdmin, createClass);
router.put('/:id', authenticateUser, isAdmin, updateClass);
router.delete('/:id', authenticateUser, isAdmin, deleteClass);
router.delete('/', authenticateUser, isAdmin, deleteAllClasses);

// Rutas que solo requieren autenticación
router.get('/', authenticateUser, getAllClasses);
router.get('/:id', authenticateUser, getClassById);
router.get('/semester/:semesterId', authenticateUser, getClassesBySemester);
router.get('/career/:careerId', authenticateUser, getClassesByCareer);

export default router;
