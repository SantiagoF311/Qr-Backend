import Class from '../models/class.js';
import Semester from '../models/semester.js';
import Career from '../models/career.js';

// Crear una nueva clase
export const createClass = async (req, res) => {
  const { nombre, descripcion, semesterIds } = req.body;

  try {
    const newClass = new Class({ nombre, descripcion, semesterIds });
    await newClass.save();
    res.status(201).json({ message: 'Clase creada con éxito', newClass });
  } catch (error) {
    console.error('Error al crear la clase:', error);
    res.status(500).json({ error: 'Error al crear la clase' });
  }
};

// Obtener todas las clases
export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    if (!classes.length) {
      return res.status(404).json({ message: 'No hay clases registradas' });
    }
    res.status(200).json(classes);
  } catch (error) {
    console.error('Error al obtener las clases:', error);
    res.status(500).json({ error: 'Error al obtener las clases' });
  }
};

// Obtener una clase por ID
export const getClassById = async (req, res) => {
  const { id } = req.params;

  try {
    const classItem = await Class.findById(id);
    if (!classItem) {
      return res.status(404).json({ error: 'Clase no encontrada' });
    }
    res.status(200).json(classItem);
  } catch (error) {
    console.error('Error al obtener la clase:', error);
    res.status(500).json({ error: 'Error al obtener la clase' });
  }
};

export const getClassesBySemester = async (req, res) => {
  const { semesterId } = req.params;
  
  try {
    const semester = await Semester.findById(semesterId);
    if (!semester) return res.status(404).json({ error: 'Semestre no encontrado' });
  
    const classes = await Class.find({ semesterIds: semesterId });
  
    res.status(200).json(classes);
  } catch (error) {
    console.error('Error al obtener las clases por semestre:', error);
    res.status(500).json({ error: 'Error al obtener las clases por semestre' });
  }
};

// Obtener clases por carrera
export const getClassesByCareer = async (req, res) => {
  const { careerId } = req.params;

  try {
    const career = await Career.findById(careerId);
    if (!career) return res.status(404).json({ error: 'Carrera no encontrada' });

    const classes = await Class.find({ carreraIds: careerId });

    res.status(200).json(classes);
  } catch (error) {
    console.error('Error al obtener las clases por carrera:', error);
    res.status(500).json({ error: 'Error al obtener las clases por carrera' });
  }
};

// Actualizar una clase por ID
export const updateClass = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, semesterIds } = req.body;

  try {
    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { nombre, descripcion, semesterIds },
      { new: true }
    );
    if (!updatedClass) {
      return res.status(404).json({ error: 'Clase no encontrada' });
    }
    res.status(200).json({ message: 'Clase actualizada con éxito', updatedClass });
  } catch (error) {
    console.error('Error al actualizar la clase:', error);
    res.status(500).json({ error: 'Error al actualizar la clase' });
  }
};

// Eliminar todas las clases
export const deleteAllClasses = async (req, res) => {
  try {
    await Class.deleteMany({});
    res.status(200).json({ message: 'Todas las clases han sido eliminadas con éxito' });
  } catch (error) {
    console.error('Error al eliminar todas las clases:', error);
    res.status(500).json({ error: 'Error al eliminar todas las clases' });
  }
};

// Eliminar una clase por ID
export const deleteClass = async (req, res) => {
  const { id } = req.params;

  try {
    const classItem = await Class.findByIdAndDelete(id);
    if (!classItem) {
      return res.status(404).json({ error: 'Clase no encontrada' });
    }
    res.status(200).json({ message: 'Clase eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar la clase:', error);
    res.status(500).json({ error: 'Error al eliminar la clase' });
  }
};
