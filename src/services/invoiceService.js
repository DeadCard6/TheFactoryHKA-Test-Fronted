import { apiClient } from './apiClient';
import { API_CONFIG } from '../config/api.config';

export const invoiceService = {
  /**
   * Obtiene todas las facturas, aplicando filtros opcionales
   * @param {Object} filters - { clientId, dateFrom, dateTo, status }
   */
  getAllInvoices: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.clientId) params.append('clientId', filters.clientId);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.status) params.append('status', filters.status);

    const response = await apiClient.get(API_CONFIG.ENDPOINTS.INVOICES.BASE, { params });
    return response.data;
  },

  getInvoiceById: async (id) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.INVOICES.BY_ID(id));
    return response.data;
  },

  createInvoice: async (invoiceData) => {
    // invoiceData structure should match CreateInvoiceRequest
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.INVOICES.BASE, invoiceData);
    return response.data;
  },

  voidInvoice: async (id) => {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.INVOICES.VOID(id));
    return response.data;
  },
  
  payInvoice: async (id) => {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.INVOICES.PAY(id));
    return response.data;
  }
};
