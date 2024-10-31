import Professor from '../../models/person/professor.js';
import { createDocument, getDocumentById, getAllDocuments } from '../../helpers/controllerHelpers.js';

// Crear un nuevo profesor
export const createProfessor = (req, res) => {
  const { username, email, password, careers, classes } = req.body;
  const professorData = { username, email, password, role: 'professor', careers, classes };
  createDocument(Professor, professorData, res, 'Profesor creado con éxito');
};

// Obtener un profesor específico
export const getProfessor = async (req, res) => {
  const { id } = req.params;
  getDocumentById(Professor, id, req, res, 'Profesor no encontrado');
};

// Obtener todos los profesores de una clase
export const getProfessorsByClass = async (req, res) => {
  const { classId } = req.params;
  await getAllDocuments(Professor, { query: { classes: classId } }, req, res, 'No se encontraron profesores para esta clase');
};

// Obtener todos los profesores de una carrera
export const getProfessorsByCareer = async (req, res) => {
  const { careerId } = req.params;
  await getAllDocuments(Professor, { query: { careers: careerId } }, req, res, 'No se encontraron profesores para esta carrera');
};
