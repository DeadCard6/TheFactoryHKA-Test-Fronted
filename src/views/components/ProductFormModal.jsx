import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { createProductInstance } from '../../models/product.model';
import { getFieldError } from '../../lib/errorHelper';

export const ProductFormModal = ({ isOpen, onClose, onSave, initialData, isLoading, isViewMode, categories }) => {
  const [formData, setFormData] = useState(createProductInstance());
  const [fieldErrors, setFieldErrors] = useState({});
  const [globalError, setGlobalError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData ? { ...initialData } : createProductInstance());
      setFieldErrors({});
      setGlobalError(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      // Ensure numeric fields are casted correctly
      const submissionData = {
        ...formData,
        categoryId: parseInt(formData.categoryId, 10),
        unitPrice: parseFloat(formData.unitPrice),
        stock: parseInt(formData.stock, 10)
      };
      const result = await onSave(submissionData);
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
          <h2>{isViewMode ? 'Detalles del Producto' : (initialData ? 'Editar Producto' : 'Nuevo Producto')}</h2>
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
                <label>Nombre del Producto</label>
                <div className="input-container">
                  <input
                    type="text"
                    name="name"
                    required={!isViewMode}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ej. Laptop Dell XPS 15"
                    style={{ paddingLeft: '1rem' }}
                    disabled={isViewMode}
                  />
                  {getFieldError(fieldErrors, 'name') && (
                    <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                      {getFieldError(fieldErrors, 'name')}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Código Interno</label>
                <div className="input-container">
                  <input
                    type="text"
                    name="code"
                    required={!isViewMode}
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Ej. PROD-001"
                    style={{ paddingLeft: '1rem' }}
                    disabled={isViewMode}
                  />
                  {getFieldError(fieldErrors, 'code') && (
                    <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                      {getFieldError(fieldErrors, 'code')}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Categoría</label>
                <div className="input-container">
                  <select
                    name="categoryId"
                    required={!isViewMode}
                    value={formData.categoryId}
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
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {getFieldError(fieldErrors, 'categoryId') && (
                    <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                      {getFieldError(fieldErrors, 'categoryId')}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group full-width">
                <label>Descripción</label>
                <div className="input-container" style={{ height: 'auto', padding: '0.5rem 0' }}>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                    placeholder="Breve descripción del producto..."
                    style={{ 
                      width: '100%', 
                      border: 'none', 
                      background: 'none', 
                      outline: 'none', 
                      padding: '0.5rem 1rem',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      minHeight: '80px',
                      color: 'var(--text-main)'
                    }}
                    disabled={isViewMode}
                  />
                  {getFieldError(fieldErrors, 'description') && (
                    <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                      {getFieldError(fieldErrors, 'description')}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Precio Unitario ($)</label>
                <div className="input-container">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="unitPrice"
                    required={!isViewMode}
                    value={formData.unitPrice}
                    onChange={handleChange}
                    placeholder="Ej. 1200.50"
                    style={{ paddingLeft: '1rem' }}
                    disabled={isViewMode}
                  />
                  {getFieldError(fieldErrors, 'unitPrice') && (
                    <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                      {getFieldError(fieldErrors, 'unitPrice')}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Stock Disponible</label>
                <div className="input-container">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    name="stock"
                    required={!isViewMode}
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Ej. 50"
                    style={{ paddingLeft: '1rem' }}
                    disabled={isViewMode}
                  />
                  {getFieldError(fieldErrors, 'stock') && (
                    <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                      {getFieldError(fieldErrors, 'stock')}
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
