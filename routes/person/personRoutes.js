import express from 'express';
import { authenticateUser, isAdmin } from '../../authMiddleware.js';
import { 
  getAllPersons,
  getPersonById,
  deleteAllPersons,
  deletePerson
} from '../../controllers/person/personController.js';

const router = express.Router();

// Rutas que requieren autenticación
router.get('/', getAllPersons); // Obtener todas las personas
router.get('/:id', getPersonById); // Obtener una persona por ID

// Rutas que requieren autenticación y permisos de admin
router.delete('/', deleteAllPersons); // Eliminar todas las personas
router.delete('/:id', deletePerson); // Eliminar una persona por ID

export default router;