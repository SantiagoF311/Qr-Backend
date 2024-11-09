import {
  createDocument,
  getAllDocuments,
  getDocumentById,
  deleteDocumentById,
  updateDocumentById
} from '../helpers/controllerHelpers.js';
import Class from '../models/class.js';

export const classController = {
  create: (req, res) => createDocument(Class, req.body, res),
  getAll: (req, res) => getAllDocuments(Class, req, res, 'No se encontraron clases'),
  getById: (req, res) => getDocumentById(Class, req.params.id, req, res, 'Clase no encontrada'),
  delete: (req, res) => deleteDocumentById(Class, req.params.id, res),
  update: (req, res) => updateDocumentById(Class, req.params.id, req.body, res)
};
