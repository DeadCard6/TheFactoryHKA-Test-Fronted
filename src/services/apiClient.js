import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

/**
 * Instancia de Axios configurada para la API de .NET
 * Incluye interceptores para autenticación con token JWT Bearer
 */
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Solicitud: Inyecta el Token JWT en el encabezado Authorization
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = Bearer ;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Respuesta: Maneja expiración de sesión (401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);
