import Person from '../../models/person/person.js';
import {
  getAllDocuments,
  getDocumentById,
  deleteAllDocuments,
  deleteDocumentById
} from '../../helpers/controllerHelpers.js';

// Obtener todas las personas con filtro opcional por rol
export const getAllPersons = (req, res) => {
  const { role } = req.query; // Extraer rol de los parámetros de consulta
  getAllDocuments(Person, req, res, 'No se encontraron personas registradas', { role }); // Pasar el filtro de rol
};

// Obtener persona por ID con filtro opcional por rol
export const getPersonById = (req, res) => {
  const { id } = req.params;
  const { role } = req.query; // Extraer rol de los parámetros de consulta
  getDocumentById(Person, id, req, res, 'Persona no encontrada', { role }); // Pasar el filtro de rol
};

// Eliminar todas las personas con filtro opcional por rol
export const deleteAllPersons = (req, res) => {
  const { role } = req.query; // Extraer rol de los parámetros de consulta
  deleteAllDocuments(Person, req, res, 'Todas las personas han sido eliminadas con éxito', { role }); // Pasar el filtro de rol
};

// Eliminar una persona por ID
export const deletePerson = (req, res) => {
  deleteDocumentById(Person, req.params.id, res);
};
