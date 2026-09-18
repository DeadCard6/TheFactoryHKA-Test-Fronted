import { apiClient } from './apiClient';
import { API_CONFIG } from '../config/api.config';

export const clientService = {
  /**
   * Obtiene la lista de todos los clientes
   */
  getAllClients: async (isActive = true) => {
    // Pasamos isActive por parámetro (por defecto true)
    const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.CLIENTS.BASE}?isActive=${isActive}`);
    return response.data;
  },

  /**
   * Obtiene un cliente por su ID
   */
  getClientById: async (id) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CLIENTS.BY_ID(id));
    return response.data;
  },

  /**
   * Crea un nuevo cliente
   */
  createClient: async (clientData) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CLIENTS.BASE, clientData);
    return response.data;
  },

  /**
   * Actualiza un cliente existente
   */
  updateClient: async (id, clientData) => {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.CLIENTS.BY_ID(id), clientData);
    return response.data;
  },

  /**
   * Reactiva un cliente (nuevo endpoint en backend)
   */
  reactivateClient: async (id) => {
    const response = await apiClient.patch(`${API_CONFIG.ENDPOINTS.CLIENTS.BY_ID(id)}/reactivate`);
    return response.data;
  },

  /**
   * Elimina un cliente
   */
  deleteClient: async (id) => {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.CLIENTS.BY_ID(id));
    return response.data;
  }
};
