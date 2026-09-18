import { useState, useCallback } from 'react';
import { initialAuthState } from '../models/auth.model';
import { authService } from '../services/authService';

/**
 * Controller de Autenticación (MVC)
 * Maneja el estado global de la sesión, login, registro y logout
 */
export function useAuthController() {
  const [authState, setAuthState] = useState(initialAuthState);

  const login = useCallback(async ({ username, password }) => {
    if (!username?.trim() || !password?.trim()) {
      setAuthState((prev) => ({
        ...prev,
        error: 'El nombre de usuario y la contraseña son obligatorios.',
      }));
      return { success: false };
    }

    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await authService.login({
        username: username.trim(),
        password: password.trim(),
      });

      const userObj = { username: username.trim() };
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userObj));

      setAuthState({
        user: userObj,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.title ||
        'Error al iniciar sesión. Verifique sus credenciales.';

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  }, []);

  const register = useCallback(async ({ username, password }) => {
    if (!username?.trim() || !password?.trim()) {
      setAuthState((prev) => ({
        ...prev,
        error: 'Por favor complete todos los campos para registrarse.',
      }));
      return { success: false };
    }

    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await authService.register({
        username: username.trim(),
        password: password.trim(),
      });

      setAuthState((prev) => ({ ...prev, isLoading: false, error: null }));
      return { success: true, message: 'Usuario registrado exitosamente. Ahora puede iniciar sesión.' };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.title ||
        'No fue posible registrar el usuario. Intente con otro nombre.';

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  const clearError = useCallback(() => {
    setAuthState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    authState,
    actions: {
      login,
      register,
      logout,
      clearError,
    },
  };
}
