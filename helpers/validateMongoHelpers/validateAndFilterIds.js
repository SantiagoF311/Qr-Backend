import { validateCareerId, validateSemesterId } from './classValidationHelpers.js'; 

export const validateAndFilterIds = async (semesterId, careerId) => {
  const filter = {};
  const validationResults = [];

  // Validación de semestre
  if (semesterId) {
    const semesterValidation = await validateSemesterId(semesterId);
    if (!semesterValidation.valid) {
      validationResults.push(semesterValidation.error);
    } else {
      filter.semesterIds = semesterId; // Filtro por semestre
    }
  }

  // Validación de carrera
  if (careerId) {
    const careerValidation = await validateCareerId(careerId);
    if (!careerValidation.valid) {
      validationResults.push(careerValidation.error);
    } else {
      filter.carreraIds = careerId; // Filtro por carrera
    }
  }

  return { valid: validationResults.length === 0, filter, errors: validationResults };
};
