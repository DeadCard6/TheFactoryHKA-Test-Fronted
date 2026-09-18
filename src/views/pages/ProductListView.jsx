import React, { useState } from 'react';
import { useProductController } from '../../controllers/useProductController';
import { ProductFormModal } from '../components/ProductFormModal';
import { formatCurrency } from '../../lib/formatCurrency';
import { Package, Plus, Pencil, Search, AlertCircle, Archive, ArchiveRestore, Eye, EyeOff } from 'lucide-react';

export const ProductListView = () => {
  const { 
    products, categories, isLoading, error, showingActive, 
    toggleShowInactive, createProduct, updateProduct, deleteProduct, reactivateProduct 
  } = useProductController();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleOpenView = (product) => {
    setEditingProduct(product);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas desactivar (archivar) este producto?')) {
      await deleteProduct(id);
    }
  };

  const handleReactivate = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas reactivar este producto?')) {
      await reactivateProduct(id);
    }
  };

  const handleSave = async (productData) => {
    let success = false;
    if (editingProduct) {
      success = await updateProduct(editingProduct.id, productData);
    } else {
      success = await createProduct(productData);
    }
    
    if (success) {
      setIsModalOpen(false);
    }
  };

  const safeProducts = Array.isArray(products) ? products : [];
  const filteredProducts = safeProducts.filter(p => {
    const nameStr = p?.name || '';
    const codeStr = p?.code || '';
    return nameStr.toLowerCase().includes(searchTerm.toLowerCase()) || 
           codeStr.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Helper para mostrar el nombre de la categoría
  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : 'Desconocida';
  };

  return (
    <div>
      {/* Header */}
      <div className="clients-header">
        <div>
          <h1 className="clients-title">
            <Package size={28} />
            {showingActive ? 'Gestión de Productos' : 'Productos Inactivos'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            {showingActive 
              ? 'Administra el inventario, precios y detalles de tus productos.' 
              : 'Lista de productos que han sido desactivados del inventario.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={toggleShowInactive}
            className="btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
          >
            {showingActive ? (
              <>
                <EyeOff size={18} />
                Ver Inactivos
              </>
            ) : (
              <>
                <Eye size={18} />
                Ver Activos
              </>
            )}
          </button>
          
          {showingActive && (
            <button
              onClick={handleOpenCreate}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus size={18} />
              Nuevo Producto
            </button>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <div>
            <h3 style={{ fontWeight: 600, marginBottom: '0.2rem' }}>Error al cargar datos</h3>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Filters/Search */}
      <div className="search-bar">
        <Search size={18} />
        <input
          type="text"
          placeholder="Buscar por nombre o código interno..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th style={{ textAlign: 'right' }}>Precio Unit.</th>
              <th style={{ textAlign: 'center' }}>Stock</th>
              <th style={{ textAlign: 'center' }}>Estado</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && products.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <div className="spinner" style={{ width: '24px', height: '24px', border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
                    Cargando productos...
                  </div>
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  {showingActive ? 'No se encontraron productos activos.' : 'No hay productos inactivos.'}
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} style={{ opacity: product.isActive ? 1 : 0.6 }}>
                  <td>
                    <div className="client-id" style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>{product.code}</div>
                  </td>
                  <td>
                    <div className="client-name">{product.name}</div>
                    <div style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                      {product.description?.length > 40 ? product.description.substring(0, 40) + '...' : product.description}
                    </div>
                  </td>
                  <td>
                    <span style={{
                      backgroundColor: '#f1f5f9',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.85rem',
                      color: 'var(--text-main)',
                      fontWeight: 500
                    }}>
                      {getCategoryName(product.categoryId)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-main)' }}>
                    {formatCurrency(product.unitPrice)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ 
                      fontWeight: 600, 
                      color: product.stock > 10 ? 'var(--primary)' : (product.stock > 0 ? '#f59e0b' : '#ef4444') 
                    }}>
                      {product.stock}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: product.isActive ? 'var(--primary-light)' : '#f1f5f9',
                      color: product.isActive ? 'var(--primary)' : 'var(--text-light)'
                    }}>
                      {product.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        onClick={() => handleOpenView(product)}
                        className="btn-icon"
                        title="Ver Detalles"
                      >
                        <Eye size={18} />
                      </button>
                      
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="btn-icon"
                        title="Editar"
                        disabled={!product.isActive}
                        style={{ opacity: !product.isActive ? 0.5 : 1, cursor: !product.isActive ? 'not-allowed' : 'pointer' }}
                      >
                        <Pencil size={18} />
                      </button>
                      
                      {product.isActive ? (
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="btn-icon delete"
                          title="Desactivar (Archivar)"
                        >
                          <Archive size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReactivate(product.id)}
                          className="btn-icon"
                          title="Reactivar"
                          style={{ color: 'var(--primary)' }}
                        >
                          <ArchiveRestore size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ProductFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingProduct}
        isLoading={isLoading}
        isViewMode={isViewMode}
        categories={categories}
      />
    </div>
  );
};
