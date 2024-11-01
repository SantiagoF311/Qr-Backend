import express from 'express';
import { authenticateUser, isAdmin } from '../authMiddleware.js';
import {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocumentById,
  deleteAllDocuments,
  deleteDocumentById
} from '../helpers/controllerHelpers.js';
import Semester from '../models/semester.js'; // Asegúrate de que esta ruta sea correcta

const router = express.Router();

// Rutas que requieren autenticación y permisos de administrador
router.post('/', authenticateUser, isAdmin, (req, res) => createDocument(Semester, req.body, res));
router.put('/:id', authenticateUser, isAdmin, (req, res) => updateDocumentById(Semester, req.params.id, req.body, res));
router.delete('/:id', authenticateUser, isAdmin, (req, res) => deleteDocumentById(Semester, req.params.id, res));
router.delete('/', authenticateUser, isAdmin, (req, res) => deleteAllDocuments(Semester, req, res));

// Rutas que requieren solo autenticación
router.get('/', authenticateUser, (req, res) => getAllDocuments(Semester, req, res));
router.get('/:id', authenticateUser, (req, res) => getDocumentById(Semester, req.params.id, req, res));

export default router;