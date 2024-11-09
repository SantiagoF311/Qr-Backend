import express from 'express';
import { authenticateUser, isAdmin } from '../authMiddleware.js';
import {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocumentById,
  deleteDocumentById,
  deleteAllDocuments
} from '../helpers/controllerHelpers.js';
import Career from '../models/career.js'; // Asegúrate de que esta ruta sea correcta

const router = express.Router();

// Rutas que requieren autenticación y ser admin
router.post('/', (req, res) => createDocument(Career, req.body, res));
router.put('/:id', (req, res) => updateDocumentById(Career, req.params.id, req.body, res));
router.delete('/', (req, res) => deleteAllDocuments(Career, req, res));
router.delete('/:id', (req, res) => deleteDocumentById(Career, req.params.id, res));

// Rutas que requieren solo autenticación
router.get('/', (req, res) => getAllDocuments(Career, req, res));
router.get('/:id', (req, res) => getDocumentById(Career, req.params.id, req, res));

export default router;
