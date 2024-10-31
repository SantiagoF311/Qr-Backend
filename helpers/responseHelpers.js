
export const sendResponse = (res, data = null, message = 'Operación exitosa') => {
    const response = {
      success: true,
      message,
      data,
    };
    res.status(200).json(response);
  };
  
  // Helper para manejar errores
  export const handleError = (res, error, message = 'Ocurrió un error en el servidor') => {
    console.error(message, error); // Log del error para depuración
    res.status(500).json({
      success: false,
      message,
      error: error.message || error,
    });
  };
  