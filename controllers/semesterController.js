import {
  createDocument,
  getAllDocuments,
  getDocumentById,
  deleteDocumentById,
  updateDocumentById
} from '../helpers/controllerHelpers.js';
import Semester from '../models/semester.js';

export const semesterController = {
  create: (req, res) => createDocument(Semester, req.body, res),
  getAll: (req, res) => getAllDocuments(Semester, req, res, 'No se encontraron semestres'),
  getById: (req, res) => getDocumentById(Semester, req.params.id, req, res, 'Semestre no encontrado'),
  delete: (req, res) => deleteDocumentById(Semester, req.params.id, res),
  update: (req, res) => updateDocumentById(Semester, req.params.id, req.body, res)
};
