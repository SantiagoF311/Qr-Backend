import Career from '../models/career.js';

// Crear una nueva carrera
export const createCareer = async (req, res) => {
  const { name, description } = req.body;

  try {
    const newCareer = new Career({ name, description });
    await newCareer.save();
    res.status(201).json({ message: 'Carrera creada con éxito', newCareer });
  } catch (error) {
    console.error('Error al crear la carrera:', error);
    res.status(500).json({ error: 'Error al crear la carrera' });
  }
};

// Obtener todas las carreras
export const getAllCareers = async (req, res) => {
  try {
    const careers = await Career.find();
    if (!careers.length) {
      return res.status(404).json({ message: 'No hay carreras registradas' });
    }
    res.status(200).json(careers);
  } catch (error) {
    console.error('Error al obtener las carreras:', error);
    res.status(500).json({ error: 'Error al obtener las carreras' });
  }
};

// Obtener una carrera por ID
export const getCareerById = async (req, res) => {
  const { id } = req.params;

  try {
    const career = await Career.findById(id);
    if (!career) {
      return res.status(404).json({ error: 'Carrera no encontrada' });
    }
    res.status(200).json(career);
  } catch (error) {
    console.error('Error al obtener la carrera:', error);
    res.status(500).json({ error: 'Error al obtener la carrera' });
  }
};

// Actualizar una carrera por ID
export const updateCareer = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const career = await Career.findByIdAndUpdate(id, { name, description }, { new: true });
    if (!career) {
      return res.status(404).json({ error: 'Carrera no encontrada' });
    }
    res.status(200).json({ message: 'Carrera actualizada con éxito', career });
  } catch (error) {
    console.error('Error al actualizar la carrera:', error);
    res.status(500).json({ error: 'Error al actualizar la carrera' });
  }
};

// Eliminar todas las carreras
export const deleteAllCareers = async (req, res) => {
  try {
    await Career.deleteMany({});
    res.status(200).json({ message: 'Todas las carreras han sido eliminadas con éxito' });
  } catch (error) {
    console.error('Error al eliminar todas las carreras:', error);
    res.status(500).json({ error: 'Error al eliminar todas las carreras' });
  }
};

// Eliminar una carrera por ID
export const deleteCareer = async (req, res) => {
  const { id } = req.params;

  try {
    const career = await Career.findByIdAndDelete(id);
    if (!career) {
      return res.status(404).json({ error: 'Carrera no encontrada' });
    }
    res.status(200).json({ message: 'Carrera eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar la carrera:', error);
    res.status(500).json({ error: 'Error al eliminar la carrera' });
  }
};
