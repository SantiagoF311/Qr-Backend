import Student from '../../models/person/student.js';
import { createDocument, getDocumentById, getAllDocuments } from '../../helpers/controllerHelpers.js';
import mongoose from 'mongoose';

// Crear un nuevo estudiante
export const createStudent = (req, res) => {
  const { username, email, password, career, classes } = req.body;
  const studentData = { username, email, password, role: 'student', career, classes };
  createDocument(Student, studentData, res, 'Estudiante creado con éxito');
};


export const getStudent = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si el ID es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID no válido' });
    }

    // Buscar el estudiante por ID sin usar populate
    const student = await Student.findById(id);

    // Verificar si el estudiante existe
    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    // Responder con el estudiante encontrado
    return res.status(200).json(student);

  } catch (error) {
    // Manejar errores internos
    console.error('Error al obtener el estudiante:', error);
    return res.status(500).json({ message: 'Error al obtener el estudiante', error: error.message });
  }
};

export const updateAttendance = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si el ID es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID no válido' });
    }

    // Buscar al estudiante por ID
    const student = await Student.findById(id);

    // Verificar si el estudiante existe
    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    // Actualizar el campo de asistencia
    student.attendance = true;  // Se marca como presente, o puedes hacer esto configurable

    await student.save();  // Guardar los cambios

    return res.status(200).json({ message: 'Asistencia actualizada correctamente', student });
  } catch (error) {
    console.error('Error al actualizar asistencia:', error);
    return res.status(500).json({ message: 'Error al actualizar la asistencia', error: error.message });
  }
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
