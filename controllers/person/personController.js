import Person from '../../models/person/person.js';

// Obtener todas las personas
export const getAllPersonsGeneral = async (req, res) => {
  try {
    const persons = await Person.find(); // Obtener todas las personas
    res.status(200).json(persons);
  } catch (error) {
    console.error('Error al obtener todas las personas:', error);
    res.status(500).json({ error: 'Error al obtener todas las personas' });
  }
};

export const getAllPersonsWithRole = async (req, res) => {
  const { role, name } = req.query; // Obtiene los parámetros de rol y nombre

  try {
    const query = {};
    
    // Si se proporciona un rol, lo agregamos a la consulta
    if (role) {
      query.role = role;
    }

    const persons = await Person.find(query);
    res.status(200).json(persons);
  } catch (error) {
    console.error('Error al obtener personas:', error);
    res.status(500).json({ error: 'Error al obtener personas' });
  }
};

// Obtener una persona por ID (general)
export const getPersonByIdGeneral = async (req, res) => {
  const { id } = req.params; // Obtiene el ID de los parámetros de la ruta

  try {
    const person = await Person.findById(id); // Busca la persona sin filtrar por rol

    if (!person) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }
    
    res.status(200).json(person);
  } catch (error) {
    console.error('Error al obtener persona por ID:', error);
    res.status(500).json({ error: 'Error al obtener la persona' });
  }
};

// Obtener una persona por ID con filtrado de rol
export const getPersonByIdWithRole = async (req, res) => {
  const { id } = req.params; // Obtiene el ID de los parámetros de la ruta
  const { role } = req.query; // Obtiene el rol de los parámetros de la consulta

  try {
    let person;

    // Verificamos si se proporciona un rol para filtrar la búsqueda
    if (role) {
      person = await Person.findOne({ _id: id, role: role });
    } else {
      // Si no se proporciona un rol, buscamos solo por ID
      person = await Person.findById(id);
    }

    if (!person) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }
    
    res.status(200).json(person);
  } catch (error) {
    console.error('Error al obtener persona por ID con rol:', error);
    res.status(500).json({ error: 'Error al obtener la persona' });
  }
};


// Eliminar todas las personas
export const deleteAllPersonsGeneral = async (req, res) => {
  try {
    await Person.deleteMany({});
    res.status(200).json({ message: 'Todas las personas han sido eliminadas con éxito' });
  } catch (error) {
    console.error('Error al eliminar todas las personas:', error);
    res.status(500).json({ error: 'Error al eliminar todas las personas' });
  }
};

// Eliminar todas las personas por rol
export const deleteAllPersonsWithRole = async (req, res) => {
  const { role } = req.query; // Obtiene el rol de los parámetros de la consulta

  try {
    const query = {};

    // Si se proporciona un rol, lo agregamos a la consulta
    if (role) {
      query.role = role;
    }

    // Eliminar las personas según el rol
    const result = await Person.deleteMany(query);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No se encontraron personas para eliminar con el rol especificado' });
    }

    res.status(200).json({ message: `Se han eliminado ${result.deletedCount} personas con el rol: ${role}` });
  } catch (error) {
    console.error('Error al eliminar personas por rol:', error);
    res.status(500).json({ error: 'Error al eliminar personas por rol' });
  }
};

// Eliminar una persona por ID (general)
export const deletePerson = async (req, res) => {
  const { id } = req.params; // Obtiene el ID de los parámetros de la ruta

  try {
    const person = await Person.findByIdAndDelete(id); // Busca y elimina la persona por ID

    if (!person) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }

    res.status(200).json({ message: 'Persona eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar persona por ID:', error);
    res.status(500).json({ error: 'Error al eliminar la persona' });
  }
};


