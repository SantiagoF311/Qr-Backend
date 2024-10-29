import Student from '../models/persons/student.js';

// Crear un nuevo estudiante
export const createStudent = async (req, res) => {
  const { username, email, password, career, classes } = req.body;
  try {
    const newStudent = new Student({ username, email, password, role: 'student', career, classes });
    await newStudent.save();
    res.status(201).json({ message: 'Estudiante creado con éxito', newStudent });
  } catch (error) {
    console.error('Error al crear estudiante:', error);
    res.status(500).json({ error: 'Error al crear estudiante' });
  }
};

// Obtener estudiantes por carrera
export const getStudentsByCareer = async (req, res) => {
  const { careerId } = req.params;
  try {
    const students = await Student.find({ career: careerId });
    res.status(200).json(students);
  } catch (error) {
    console.error('Error al obtener estudiantes por carrera:', error);
    res.status(500).json({ error: 'Error al obtener estudiantes por carrera' });
  }
};

export const getStudentsByClass = async (req, res) => {
  const { classId } = req.params; // Obtiene el ID de la clase de los parámetros de la ruta

  try {
    // Busca los estudiantes que están en la clase especificada
    const students = await Student.find({ classes: classId });
    
    if (!students.length) {
      return res.status(404).json({ message: 'No se encontraron estudiantes para esta clase' });
    }
    
    res.status(200).json(students);
  } catch (error) {
    console.error('Error al obtener estudiantes por clase:', error);
    res.status(500).json({ error: 'Error al obtener estudiantes por clase' });
  }
};
