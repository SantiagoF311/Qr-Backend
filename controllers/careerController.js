import {
  createDocument,
  getAllDocuments,
  getDocumentById,
  deleteDocumentById,
  updateDocumentById
} from '../helpers/controllerHelpers.js';
import Career from '../models/career.js';

export const careerController = {
  create: async (req, res) => {
    try {
      // Crear la carrera
      const newCareer = new Career(req.body);
      await newCareer.save();
  
      // Actualizar las clases asociadas a la carrera
      const { classes } = req.body;  // Las clases que llegan desde el frontend
  
      for (let classItem of classes) {
        // Actualizar cada clase para que su campo "career" apunte a la nueva carrera
        await Class.findByIdAndUpdate(classItem.classId, { $set: { career: newCareer._id } });
      }
  
      // Responder con el éxito
      sendResponse(res, newCareer, 'Carrera creada con éxito');
    } catch (error) {
      handleError(res, error, 'Error al crear la carrera');
    }
  },
  getAll: (req, res) => getAllDocuments(Career, req, res, 'No se encontraron carreras'),
  getById: (req, res) => getDocumentById(Career, req.params.id, req, res, 'Carrera no encontrada'),
  delete: (req, res) => deleteDocumentById(Career, req.params.id, res),
  update: (req, res) => updateDocumentById(Career, req.params.id, req.body, res)
};
