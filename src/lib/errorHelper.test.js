import { describe, it, expect } from 'vitest';
import { parseApiError, getFieldError } from './errorHelper';

describe('errorHelper', () => {
  describe('parseApiError', () => {
    it('handles network errors (no response)', () => {
      const error = { message: 'Network Error' };
      const result = parseApiError(error);
      expect(result.message).toBe('Error de red. No se pudo conectar con el servidor.');
      expect(result.fieldErrors).toEqual({});
    });

    it('handles 401 Unauthorized', () => {
      const error = { response: { status: 401, data: {} } };
      const result = parseApiError(error);
      expect(result.message).toBe('Sesión expirada o credenciales inválidas.');
    });

    it('handles HTML responses like 502 Bad Gateway', () => {
      const error = { response: { status: 502, data: '<html><body>502 Bad Gateway</body></html>' } };
      const result = parseApiError(error);
      expect(result.message).toBe('Error interno del servidor. Contacte a soporte si el problema persiste.');
      expect(result.fieldErrors).toEqual({});
    });

    it('handles plain string response', () => {
      const error = { response: { status: 400, data: 'Plain error string' } };
      const result = parseApiError(error);
      expect(result.message).toBe('Plain error string');
    });

    it('handles { error: "message" } payload', () => {
      const error = { response: { status: 400, data: { error: 'Custom error message' } } };
      const result = parseApiError(error);
      expect(result.message).toBe('Custom error message');
    });

    it('handles ASP.NET ValidationProblemDetails and normalizes keys', () => {
      const error = {
        response: {
          status: 400,
          data: {
            title: 'One or more validation errors occurred.',
            errors: {
              'UnitPrice': ['El precio unitario no es válido.'],
              '$.categoryId': ['La categoría no fue encontrada.'],
              'Details[0].Quantity': ['La cantidad debe ser mayor a 0.'],
              'Details[1].ProductId': ['Producto inválido.'],
            }
          }
        }
      };

      const result = parseApiError(error);
      
      expect(result.message).toBe('One or more validation errors occurred.');
      
      // Check normalization rules
      expect(result.fieldErrors).toEqual({
        'unitprice': ['El precio unitario no es válido.'],
        'categoryid': ['La categoría no fue encontrada.'],
        'details.0.quantity': ['La cantidad debe ser mayor a 0.'],
        'details.1.productid': ['Producto inválido.'],
      });
    });
  });

  describe('getFieldError', () => {
    it('safely retrieves error messages using case-insensitive normalization', () => {
      const fieldErrors = {
        'unitprice': ['Error 1'],
        'details.0.quantity': ['Error 2']
      };

      // Exact match
      expect(getFieldError(fieldErrors, 'unitprice')).toBe('Error 1');
      
      // PascalCase request
      expect(getFieldError(fieldErrors, 'UnitPrice')).toBe('Error 1');
      
      // Array syntax request
      expect(getFieldError(fieldErrors, 'Details[0].Quantity')).toBe('Error 2');
      
      // Non-existent key
      expect(getFieldError(fieldErrors, 'description')).toBeNull();
      
      // Null safety
      expect(getFieldError(null, 'unitprice')).toBeNull();
      expect(getFieldError(fieldErrors, null)).toBeNull();
    });
  });
});
