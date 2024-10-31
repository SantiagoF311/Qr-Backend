import {
  createDocument,
  getAllDocuments,
  getDocumentById,
  deleteDocumentById,
  updateDocumentById
} from '../helpers/controllerHelpers.js';
import Career from '../models/career.js';

export const careerController = {
  create: (req, res) => createDocument(Career, req.body, res),
  getAll: (req, res) => getAllDocuments(Career, req, res, 'No se encontraron carreras'),
  getById: (req, res) => getDocumentById(Career, req.params.id, req, res, 'Carrera no encontrada'),
  delete: (req, res) => deleteDocumentById(Career, req.params.id, res),
  update: (req, res) => updateDocumentById(Career, req.params.id, req.body, res)
};
