import { apiClient } from './apiClient';
import { API_CONFIG } from '../config/api.config';

/**
 * Servicio de Autenticación
 * Comunica con el controlador AuthController de .NET
 */
export const authService = {
  /**
   * Inicia sesión con credenciales y retorna el token JWT
   * @param {{ username: string, password: string }} credentials
   * @returns {Promise<{ token: string }>}
   */
  async login(credentials) {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  /**
   * Registra un nuevo usuario en la base de datos
   * @param {{ username: string, password: string }} userData
   * @returns {Promise<{ message: string }>}
   */
  async register(userData) {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },
};
