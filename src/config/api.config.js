/**
 * Configuración Centralizada de la API
 * Define la URL base y las rutas de los controladores del backend .NET
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7017/api',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/Auth/login',
      REGISTER: '/Auth/register',
    },
    CLIENTS: {
      BASE: '/Clients',
      BY_ID: (id) => `/Clients/${id}`,
    },
    PRODUCTS: {
      BASE: '/Products',
      BY_ID: (id) => `/Products/${id}`,
    },
    INVOICES: {
      BASE: '/Invoices',
      BY_ID: (id) => `/Invoices/${id}`,
      VOID: (id) => `/Invoices/${id}/void`,
    },
  },
};
