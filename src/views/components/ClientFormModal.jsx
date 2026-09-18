import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { createClientInstance } from '../../models/client.model';

export const ClientFormModal = ({ isOpen, onClose, onSave, initialData, isLoading, isViewMode }) => {
  const [formData, setFormData] = useState(createClientInstance());

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData ? { ...initialData } : createClientInstance());
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isViewMode) {
      onSave(formData);
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
