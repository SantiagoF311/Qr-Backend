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
import Class from '../models/class.js'; // Asegúrate de que esta ruta sea correcta

const router = express.Router();

// Rutas que requieren autenticación y permisos de admin
router.post('/', authenticateUser, isAdmin, (req, res) => createDocument(Class, req.body, res));
router.put('/:id', authenticateUser, isAdmin, (req, res) => updateDocumentById(Class, req.params.id, req.body, res));
router.delete('/:id', authenticateUser, isAdmin, (req, res) => deleteDocumentById(Class, req.params.id, res));
router.delete('/', authenticateUser, isAdmin, (req, res) => deleteAllDocuments(Class, req, res));

// Rutas que solo requieren autenticación
router.get('/', authenticateUser, (req, res) => getAllDocuments(Class, req, res));
router.get('/:id', authenticateUser, (req, res) => getDocumentById(Class, req.params.id, req, res));
router.get('/semester/:semesterId', authenticateUser, (req, res) => getAllDocuments(Class, { semesterId: req.params.semesterId }, req, res));
router.get('/career/:careerId', authenticateUser, (req, res) => getAllDocuments(Class, { careerId: req.params.careerId }, req, res));

export default router;
