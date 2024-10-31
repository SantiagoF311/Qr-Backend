import Student from '../../models/person/student.js';
import { createDocument, getDocumentById, getAllDocuments } from '../../helpers/controllerHelpers.js';

// Crear un nuevo estudiante
export const createStudent = (req, res) => {
  const { username, email, password, career, classes } = req.body;
  const studentData = { username, email, password, role: 'student', career, classes };
  createDocument(Student, studentData, res, 'Estudiante creado con éxito');
};

// Obtener un estudiante específico
export const getStudent = async (req, res) => {
  const { id } = req.params;
  getDocumentById(Student, id, req, res, 'Estudiante no encontrado');
};

// Obtener todos los estudiantes de una clase
export const getStudentsByClass = async (req, res) => {
  const { classId } = req.params;
  await getAllDocuments(Student, { query: { classes: classId } }, req, res, 'No se encontraron estudiantes para esta clase');
};

// Obtener todos los estudiantes de una carrera
export const getStudentsByCareer = async (req, res) => {
  const { careerId } = req.params;
  await getAllDocuments(Student, { query: { career: careerId } }, req, res, 'No se encontraron estudiantes para esta carrera');
};
