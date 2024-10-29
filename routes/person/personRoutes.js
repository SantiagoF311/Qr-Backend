import express from 'express';
import { authenticateUser, isAdmin } from '../../authMiddleware.js';
import { 
  getAllPersonsGeneral,
  getAllPersonsWithRole,
  getPersonByIdGeneral,
  deleteAllPersonsGeneral,
  deleteAllPersonsWithRole, 
  deletePerson
} from '../../controllers/person/personController.js';

const router = express.Router();

// Rutas que requieren autenticación
router.get('/', authenticateUser, getAllPersonsGeneral); // Obtener todas las personas
router.get('/filter', authenticateUser, getAllPersonsWithRole); // Filtrar personas por rol o nombre
router.get('/:id', authenticateUser, getPersonByIdGeneral); // Obtener una persona por ID

// Rutas que requieren autenticación y permisos de admin
router.delete('/', authenticateUser, isAdmin, deleteAllPersonsGeneral); // Eliminar todas las personas
router.delete('/filter', authenticateUser, isAdmin, deleteAllPersonsWithRole); // Eliminar por rol
router.delete('/:id', authenticateUser, isAdmin, deletePerson); // Eliminar una persona por ID

export default router;