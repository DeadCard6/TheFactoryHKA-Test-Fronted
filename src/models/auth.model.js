/**
 * Modelo de Autenticación (MVC)
 * Estructuras de datos para el estado de sesión y credenciales
 */

export const initialAuthState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: Boolean(localStorage.getItem('token')),
  isLoading: false,
  error: null,
};

export const initialLoginFormState = {
  username: '',
  password: '',
};
