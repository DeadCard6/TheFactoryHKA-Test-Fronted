import React, { useState } from 'react';
import { LogIn, UserPlus, Lock, User, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

/**
 * Vista de Autenticación / Login (MVC)
 * Permite a los usuarios autenticarse o registrarse para interactuar con la API
 */
export function LoginView({ authState, actions }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });
  const [successNotice, setSuccessNotice] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (authState.error) actions.clearError();
    if (successNotice) setSuccessNotice('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessNotice('');

    if (isRegisterMode) {
      const res = await actions.register(form);
      if (res.success) {
        setSuccessNotice(res.message);
        setIsRegisterMode(false);
        setForm({ username: form.username, password: '' });
      }
    } else {
      await actions.login(form);
    }
  };

  const toggleMode = () => {
    setIsRegisterMode((prev) => !prev);
    actions.clearError();
    setSuccessNotice('');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-badge">
            <span>Sistema POS & Facturación</span>
          </div>
          <h1 className="auth-title">The Factory HKA</h1>
          <p className="auth-subtitle">
            {isRegisterMode
              ? 'Crea una cuenta para acceder a la plataforma'
              : 'Ingresa tus credenciales para acceder al sistema'}
          </p>
        </div>

        {/* Notificaciones de error o éxito */}
        {authState.error && (
          <div className="alert alert-error" role="alert">
            <AlertCircle className="alert-icon" size={18} />
            <span>{authState.error}</span>
          </div>
        )}

        {successNotice && (
          <div className="alert alert-success" role="status">
            <CheckCircle2 className="alert-icon" size={18} />
            <span>{successNotice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <div className="input-container">
              <User className="input-icon" size={18} />
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="Ej. admin o jdoe"
                value={form.username}
                onChange={handleChange}
                disabled={authState.isLoading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-container">
              <Lock className="input-icon" size={18} />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                disabled={authState.isLoading}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-submit"
            disabled={authState.isLoading}
          >
            {authState.isLoading ? (
              <>
                <Loader2 className="spinner" size={18} />
                <span>Procesando...</span>
              </>
            ) : isRegisterMode ? (
              <>
                <UserPlus size={18} />
                <span>Registrar Usuario</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Iniciar Sesión</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isRegisterMode ? '¿Ya tienes una cuenta?' : '¿No tienes cuenta registrada?'}
            <button
              type="button"
              className="btn-link"
              onClick={toggleMode}
              disabled={authState.isLoading}
            >
              {isRegisterMode ? 'Inicia sesión aquí' : 'Regístrate aquí'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
