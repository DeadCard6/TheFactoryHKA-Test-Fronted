import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { createClientInstance } from '../../models/client.model';
import { getFieldError } from '../../lib/errorHelper';

export const ClientFormModal = ({ isOpen, onClose, onSave, initialData, isLoading, isViewMode }) => {
  const [formData, setFormData] = useState(createClientInstance());
  const [fieldErrors, setFieldErrors] = useState({});
  const [globalError, setGlobalError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData ? { ...initialData } : createClientInstance());
      setFieldErrors({});
      setGlobalError(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar el error de este campo al escribir
    if (fieldErrors[name.toLowerCase()]) {
      setFieldErrors(prev => ({ ...prev, [name.toLowerCase()]: undefined }));
    }
    setGlobalError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isViewMode) {
      setFieldErrors({});
      setGlobalError(null);
      const result = await onSave(formData);
      if (result && !result.success) {
        if (result.parsedError) {
          setFieldErrors(result.parsedError.fieldErrors || {});
          setGlobalError(result.parsedError.message);
        } else {
          setGlobalError('Error inesperado al guardar.');
        }
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isViewMode ? 'Detalles del Cliente' : (initialData ? 'Editar Cliente' : 'Nuevo Cliente')}</h2>
          <button type="button" onClick={onClose} className="btn-close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" style={{ padding: '0' }}>
          <div className="modal-body">
            {globalError && (
              <div className="alert alert-error" style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <AlertCircle size={18} />
                <span style={{ fontSize: '0.9rem' }}>{globalError}</span>
              </div>
            )}
            <div className="form-grid">
              
              <div className="form-group full-width">
                <label>Nombres</label>
                <div className="input-container">
                  <input
                    type="text"
                    name="firstName"
                    required={!isViewMode}
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Ej. Juan"
                    style={{ paddingLeft: '1rem' }}
                    disabled={isViewMode}
                  />
                  {getFieldError(fieldErrors, 'firstName') && (
                    <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                      {getFieldError(fieldErrors, 'firstName')}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group full-width">
                <label>Apellidos</label>
                <div className="input-container">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName || ''}
                    onChange={handleChange}
                    placeholder="Ej. Pérez"
                    style={{ paddingLeft: '1rem' }}
                    disabled={isViewMode}
                  />
                  {getFieldError(fieldErrors, 'lastName') && (
                    <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                      {getFieldError(fieldErrors, 'lastName')}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Tipo de Documento</label>
                <div className="input-container">
                  <select
                    name="documentType"
                    required={!isViewMode}
                    value={formData.documentType}
                    onChange={handleChange}
                    style={{ 
                      width: '100%', 
                      border: 'none', 
                      background: 'none', 
                      outline: 'none', 
                      padding: '0.6rem 1rem',
                      color: 'var(--text-main)'
                    }}
                    disabled={isViewMode}
                  >
                    <option value="">Seleccione...</option>
                    <option value="CC">Cédula de Ciudadanía</option>
                    <option value="CE">Cédula de Extranjería</option>
                    <option value="NIT">NIT</option>
                    <option value="Pasaporte">Pasaporte</option>
                  </select>
                  {getFieldError(fieldErrors, 'documentType') && (
                    <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                      {getFieldError(fieldErrors, 'documentType')}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Número de Documento</label>
                <div className="input-container">
                  <input
                    type="text"
                    name="documentNumber"
                    required={!isViewMode}
                    value={formData.documentNumber}
                    onChange={handleChange}
                    placeholder="Ej. 123456789"
                    style={{ paddingLeft: '1rem' }}
                    disabled={isViewMode}
                  />
                  {getFieldError(fieldErrors, 'documentNumber') && (
                    <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                      {getFieldError(fieldErrors, 'documentNumber')}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group full-width">
                <label>Correo Electrónico</label>
                <div className="input-container">
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    placeholder="Ej. juan@ejemplo.com"
                    style={{ paddingLeft: '1rem' }}
                    disabled={isViewMode}
                  />
                  {getFieldError(fieldErrors, 'email') && (
                    <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                      {getFieldError(fieldErrors, 'email')}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <div className="input-container">
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    placeholder="Ej. +1 234 567"
                    style={{ paddingLeft: '1rem' }}
                    disabled={isViewMode}
                  />
                  {getFieldError(fieldErrors, 'phone') && (
                    <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                      {getFieldError(fieldErrors, 'phone')}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Dirección</label>
                <div className="input-container">
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    placeholder="Ej. Calle 123"
                    style={{ paddingLeft: '1rem' }}
                    disabled={isViewMode}
                  />
                  {getFieldError(fieldErrors, 'address') && (
                    <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                      {getFieldError(fieldErrors, 'address')}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
            >
              {isViewMode ? 'Cerrar' : 'Cancelar'}
            </button>
            {!isViewMode && (
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
                style={{ padding: '0.4rem 1rem' }}
              >
                {isLoading ? (
                  <div className="spinner" style={{ width: '18px', height: '18px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
                ) : (
                  <Save size={18} />
                )}
                Guardar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
