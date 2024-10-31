export const validateModelById = async (Model, id) => {
    try {
      const document = await Model.findById(id);
      if (!document) {
        return { valid: false, message: `${Model.modelName} no encontrado` };
      }
      return { valid: true, document };
    } catch (error) {
      return { valid: false, message: 'Error en la validación del modelo' };
    }
  };
  