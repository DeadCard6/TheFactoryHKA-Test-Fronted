/**
 * Parses an API error (Axios error) and extracts a generic message and field-specific errors.
 * Normalizes field keys to a predictable format (lowercase, dot notation for arrays, no leading $.).
 * 
 * @param {Error} error - The error thrown by Axios or the API client
 * @returns {{ message: string, fieldErrors: Object.<string, string[]> }}
 */
export const parseApiError = (error) => {
  const result = {
    message: 'Ha ocurrido un error inesperado. Por favor, intente de nuevo.',
    fieldErrors: {}
  };

  if (!error.response) {
    result.message = 'Error de red. No se pudo conectar con el servidor.';
    return result;
  }

  const { status, data } = error.response;

  if (status === 401) {
    result.message = 'Sesión expirada o credenciales inválidas.';
  } else if (status === 403) {
    result.message = 'No tienes permisos para realizar esta acción.';
  } else if (status === 404) {
    result.message = 'El recurso solicitado no fue encontrado.';
  } else if (status >= 500) {
    result.message = 'Error interno del servidor. Contacte a soporte si el problema persiste.';
  }

  // Handle HTML responses (e.g., 502 Bad Gateway)
  if (typeof data === 'string') {
    if (data.trim().toLowerCase().startsWith('<html')) {
      // Don't expose HTML to the user
      return result;
    }
    // If it's a simple string, use it as the message
    result.message = data;
    return result;
  }

  // Handle standard JSON errors
  if (data) {
    // If backend returns a simple { error: "message" }
    if (data.error && typeof data.error === 'string') {
      result.message = data.error;
    } 
    // If backend returns a ProblemDetails { detail: "message" }
    else if (data.detail && typeof data.detail === 'string') {
      result.message = data.detail;
    }
    // Fallback title from ProblemDetails
    else if (data.title && typeof data.title === 'string') {
      result.message = data.title;
    }

    // Parse ASP.NET ValidationProblemDetails
    if (data.errors && typeof data.errors === 'object') {
      const normalizedErrors = {};
      
      for (const [key, messages] of Object.entries(data.errors)) {
        if (!Array.isArray(messages)) continue;

        // Normalization rule: 
        // 1. Remove leading $.
        // 2. Replace [n] with .n
        // 3. Lowercase
        // Example: Details[0].Quantity -> details.0.quantity
        let normalizedKey = key.replace(/^\$\./, '');
        normalizedKey = normalizedKey.replace(/\[(\d+)\]/g, '.$1');
        normalizedKey = normalizedKey.toLowerCase();

        normalizedErrors[normalizedKey] = messages;
      }
      
      result.fieldErrors = normalizedErrors;
    }
  }

  return result;
};

/**
 * Helper to safely extract a field error message from the normalized fieldErrors object.
 * Performs a case-insensitive lookup.
 * 
 * @param {Object.<string, string[]>} fieldErrors - The normalized errors object
 * @param {string} fieldName - The name of the field to look up (e.g., 'unitPrice')
 * @returns {string|null} The first error message for the field, or null if none
 */
export const getFieldError = (fieldErrors, fieldName) => {
  if (!fieldErrors || !fieldName) return null;
  
  // Normalization rule: lowercasing the field name requested
  // Note: Since we normalized all keys to lowercase in parseApiError, we just need to lowercase the lookup.
  // If the lookup contains array indices like 'details[0].quantity', we should ideally normalize it the same way.
  let normalizedField = fieldName.replace(/^\$\./, '').replace(/\[(\d+)\]/g, '.$1').toLowerCase();
  
  const messages = fieldErrors[normalizedField];
  return messages && messages.length > 0 ? messages[0] : null;
};
