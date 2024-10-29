import Professor from '../models/persons/professor.js';

// Crear un nuevo profesor
export const createProfessor = async (req, res) => {
  const { username, email, password, careers, classes } = req.body;
  try {
    const newProfessor = new Professor({ username, email, password, role: 'professor', careers, classes });
    await newProfessor.save();
    res.status(201).json({ message: 'Profesor creado con éxito', newProfessor });
  } catch (error) {
    console.error('Error al crear profesor:', error);
    res.status(500).json({ error: 'Error al crear profesor' });
  }
};

// Obtener profesores por carrera
export const getProfessorsByCareer = async (req, res) => {
  const { careerId } = req.params;
  try {
    const professors = await Professor.find({ careers: careerId });
    res.status(200).json(professors);
  } catch (error) {
    console.error('Error al obtener profesores por carrera:', error);
    res.status(500).json({ error: 'Error al obtener profesores por carrera' });
  }
};

// Obtener profesores por clase
export const getProfessorsByClass = async (req, res) => {
  const { classId } = req.params; // Obtiene el ID de la clase de los parámetros de la ruta

  try {
    // Busca a los profesores que enseñan la clase especificada
    const professors = await Professor.find({ classes: classId });

    if (professors.length === 0) {
      return res.status(404).json({ message: 'No se encontraron profesores para esta clase' });
    }

    res.status(200).json(professors);
  } catch (error) {
    console.error('Error al obtener profesores por clase:', error);
    res.status(500).json({ error: 'Error al obtener profesores por clase' });
  }
};

