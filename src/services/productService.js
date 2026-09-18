import { apiClient } from './apiClient';
import { API_CONFIG } from '../config/api.config';

export const productService = {
  /**
   * Obtiene la lista de todos los productos (soporta filtros por categoryId, isActive y name)
   */
  getAllProducts: async (isActive = true, categoryId = null, name = null) => {
    // Construimos la query string
    const params = new URLSearchParams();
    params.append('isActive', isActive);
    if (categoryId) params.append('categoryId', categoryId);
    if (name) params.append('name', name);

    const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.PRODUCTS.BASE}?${params.toString()}`);
    return response.data;
  },

  /**
   * Obtiene un producto por su ID
   */
  getProductById: async (id) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.PRODUCTS.BY_ID(id));
    return response.data;
  },

  /**
   * Crea un nuevo producto
   */
  createProduct: async (productData) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.PRODUCTS.BASE, productData);
    return response.data;
  },

  /**
   * Actualiza un producto existente
   */
  updateProduct: async (id, productData) => {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.PRODUCTS.BY_ID(id), productData);
    return response.data;
  },  /**
   * Reactiva un producto archivado
   */
  reactivateProduct: async (id) => {
    const response = await apiClient.patch(`${API_CONFIG.ENDPOINTS.PRODUCTS.BY_ID(id)}/reactivate`);
    return response.data;
  },

  /**
   * Elimina (archiva) un producto
   */
  deleteProduct: async (id) => {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.PRODUCTS.BY_ID(id));
    return response.data;
  },

  /**
   * Obtiene la lista de categorías para el formulario
   */
  getAllCategories: async () => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CATEGORIES.BASE);
    return response.data;
  }
};
