import { sendResponse, handleError } from './responseHelpers.js';
import { validateAndFilterIds } from './validateMongoHelpers/validateAndFilterIds.js';

// Crear un documento
export const createDocument = async (Model, data, res, successMessage) => {
  try {
    const document = new Model(data);
    await document.save();
    sendResponse(res, document, successMessage || `${Model.modelName} creado con éxito`);
  } catch (error) {
    handleError(res, error, `Error al crear ${Model.modelName}`);
  }
};

// Obtener todos los documentos con filtro opcional
export const getAllDocuments = async (Model, req, res, notFoundMessage, additionalFilter = {}) => {
  const { semesterId, careerId } = req.query;

  try {
    const { valid, filter, errors } = await validateAndFilterIds(semesterId, careerId);

    if (!valid) {
      return res.status(404).json({ error: errors.join(', ') });
    }

    // Combinar el filtro existente con el filtro adicional
    const documents = await Model.find({ ...filter, ...additionalFilter });
    if (!documents.length) {
      return res.status(404).json({ message: notFoundMessage || `No se encontraron ${Model.modelName}` });
    }
    sendResponse(res, documents);
  } catch (error) {
    handleError(res, error, `Error al obtener todos los ${Model.modelName}`);
  }
};

// Obtener un documento por ID con filtro opcional
export const getDocumentById = async (Model, id, req, res, notFoundMessage, additionalFilter = {}) => {
  const { semesterId, careerId } = req.query;

  try {
    const { valid, filter, errors } = await validateAndFilterIds(semesterId, careerId);

    if (!valid) {
      return res.status(404).json({ error: errors.join(', ') });
    }

    const document = await Model.findOne({ _id: id, ...filter, ...additionalFilter });
    if (!document) {
      return res.status(404).json({ message: notFoundMessage || `${Model.modelName} no encontrado` });
    }
    sendResponse(res, document);
  } catch (error) {
    handleError(res, error, `Error al obtener ${Model.modelName} por ID`);
  }
};

// Eliminar todos los documentos con filtro opcional
export const deleteAllDocuments = async (Model, res, successMessage, additionalFilter = {}) => {
  try {
    const result = await Model.deleteMany(additionalFilter);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: `No se encontraron ${Model.modelName} para eliminar` });
    }
    sendResponse(
      res,
      null,
      successMessage || `Se han eliminado ${result.deletedCount} ${Model.modelName}`
    );
  } catch (error) {
    handleError(res, error, `Error al eliminar todos los ${Model.modelName}`);
  }
};

// Eliminar un documento por ID
export const deleteDocumentById = async (Model, id, res) => {
  try {
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return res.status(404).json({ message: `${Model.modelName} no encontrado` });
    }
    sendResponse(res, null, `${Model.modelName} eliminado con éxito`);
  } catch (error) {
    handleError(res, error, `Error al eliminar ${Model.modelName}`);
  }
};

// Actualizar un documento por ID
export const updateDocumentById = async (Model, id, data, res, successMessage) => {
  try {
    const document = await Model.findByIdAndUpdate(id, data, { new: true });
    if (!document) {
      return res.status(404).json({ message: `${Model.modelName} no encontrado` });
    }
    sendResponse(res, document, successMessage || `${Model.modelName} actualizado con éxito`);
  } catch (error) {
    handleError(res, error, `Error al actualizar ${Model.modelName}`);
  }
};
