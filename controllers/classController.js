import {
  createDocument,
  getAllDocuments,
  getDocumentById,
  deleteDocumentById,
  updateDocumentById
} from '../helpers/controllerHelpers.js';
import Class from '../models/class.js';

export const classController = {
  create: (req, res) => {
    const semesterIds = req.body.semesterIds;
    if (!Array.isArray(semesterIds) || !semesterIds.every(semester => [1, 2, 3, 4, 5, 6, 7, 8, 9].includes(semester))) {
      return res.status(400).json({ message: 'Los semestres deben ser números entre 1 y 9' });
    }

    createDocument(Class, req.body, res);
  },
  getAll: (req, res) => getAllDocuments(Class, req, res, 'No se encontraron clases'),
  getById: (req, res) => getDocumentById(Class, req.params.id, req, res, 'Clase no encontrada'),
  delete: (req, res) => deleteDocumentById(Class, req.params.id, res),
  update: (req, res) => updateDocumentById(Class, req.params.id, req.body, res)
};
