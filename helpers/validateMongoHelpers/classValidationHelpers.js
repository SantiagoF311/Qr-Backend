// helpers/specificValidationHelpers.js
import Semester from '../../models/semester.js';
import Career from '../../models/career.js';
import { validateModelById } from './validateGeneralHelper.js'; // Asegúrate de importar la función general

export const validateSemesterId = async (semesterId) => {
  if (semesterId) {
    const validation = await validateModelById(Semester, semesterId);
    if (!validation.valid) {
      return { valid: false, error: validation.message };
    }
  }
  return { valid: true };
};

export const validateCareerId = async (careerId) => {
  if (careerId) {
    const validation = await validateModelById(Career, careerId);
    if (!validation.valid) {
      return { valid: false, error: validation.message };
    }
  }
  return { valid: true };
};

// Aquí puedes agregar más validaciones específicas si es necesario
