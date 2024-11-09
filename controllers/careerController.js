import {
  createDocument,
  getAllDocuments,
  getDocumentById,
  deleteDocumentById,
  updateDocumentById
} from '../helpers/controllerHelpers.js';
import Career from '../models/career.js';
import Class from '../models/class.js';

export const careerController = {
  create: async (req, res) => {
    try {
      // Crear la carrera
      const newCareer = new Career(req.body);
      await newCareer.save();
  
      // Obtener las clases asociadas a la carrera desde el cuerpo de la solicitud
      const { classes } = req.body;  // Las clases que llegan desde el frontend
  
      // Si hay clases, actualizamos cada una para asignarles la nueva carrera
      if (classes && classes.length > 0) {
        for (let classItem of classes) {
          // Asumimos que cada classItem tiene classId y los semestres asociados
          await Class.findByIdAndUpdate(classItem.classId, {
            $set: { career: newCareer._id, semesters: classItem.semesters || [] } // Actualizamos también los semestres
          });
        }
      }
  
      // Responder con el éxito
      sendResponse(res, newCareer, 'Carrera creada con éxito');
    } catch (error) {
      handleError(res, error, 'Error al crear la carrera');
    }
  },

  getAll: (req, res) => getAllDocuments(Career, req, res, 'No se encontraron carreras'),

  getById: async (req, res) => {
    try {
      const career = await Career.findById(req.params.id).populate({
        path: 'classes',
        select: 'name description semesters', // Incluye las clases y sus semestres
      });
      if (!career) {
        return res.status(404).json({ message: 'Carrera no encontrada' });
      }
      return res.json(career);
    } catch (error) {
      handleError(res, error, 'Error al obtener la carrera');
    }
  },

  delete: (req, res) => deleteDocumentById(Career, req.params.id, res),

  update: (req, res) => updateDocumentById(Career, req.params.id, req.body, res)
};
