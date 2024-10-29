import Semester from '../models/semester.js';
import Career from '../models/career.js';

export const createSemester = async (req, res) => {
  const { carreraId, numero, clases } = req.body;

  try {
    const carrera = await Career.findById(carreraId);
    if (!carrera) return res.status(404).json({ error: 'Carrera no encontrada' });

    const newSemester = new Semester({ carrera: carreraId, numero, clases });
    await newSemester.save();

    res.status(201).json({ message: 'Semestre creado con éxito', newSemester });
  } catch (error) {
    console.error('Error al crear el semestre:', error);
    res.status(500).json({ error: 'Error al crear el semestre' });
  }
};

// Obtener todos los semestres
export const getAllSemesters = async (req, res) => {
  try {
    const semesters = await Semester.find(); 

    if (!semesters.length) {
      return res.status(404).json({ message: 'No hay semestres registrados' });
    }

    res.status(200).json(semesters);
  } catch (error) {
    console.error('Error al obtener los semestres:', error);
    res.status(500).json({ error: 'Error al obtener los semestres' });
  }
};



// Método para borrar todos los semestres
export const deleteAllSemesters = async (req, res) => {
  try {
    await Semester.deleteMany(); // Elimina todos los semestres

    res.status(200).json({ message: 'Todos los semestres eliminados con éxito' });
  } catch (error) {
    console.error('Error al eliminar todos los semestres:', error);
    res.status(500).json({ error: 'Error al eliminar todos los semestres' });
  }
};

// Método para borrar semestre
export const deleteSemester = async (req, res) => {
  const { id } = req.params; // Obtiene el ID del semestre de los parámetros de la ruta

  try {
    const semester = await Semester.findById(id);
    if (!semester) return res.status(404).json({ error: 'Semestre no encontrado' });

    await Semester.findByIdAndDelete(id); // Elimina el semestre

    res.status(200).json({ message: 'Semestre eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar el semestre:', error);
    res.status(500).json({ error: 'Error al eliminar el semestre' });
  }
};

