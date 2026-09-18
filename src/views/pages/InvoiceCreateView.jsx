import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartController } from '../../controllers/useCartController';
import { useInvoiceController } from '../../controllers/useInvoiceController';
import { useClientController } from '../../controllers/useClientController';
import { useProductController } from '../../controllers/useProductController';
import { formatCurrency } from '../../lib/formatCurrency';
import { ShoppingCart, Plus, Trash2, AlertTriangle, AlertCircle, Save, ChevronLeft } from 'lucide-react';

export const InvoiceCreateView = () => {
  const navigate = useNavigate();
  const { cartItems, discount, setDiscount, addItem, updateQuantity, removeItem, clearCart, reconcileCart, subtotal, tax, total } = useCartController();
  const { createInvoice, isLoading: isCreating } = useInvoiceController();
  const { clients } = useClientController();
  const { products, fetchProducts, isLoading: isProductsLoading } = useProductController();

  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [addQuantity, setAddQuantity] = useState(1);
  const [globalError, setGlobalError] = useState(null);
  const [reconcilePrompt, setReconcilePrompt] = useState(false);

  // Load only active products
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = () => {
    if (!selectedProductId) return;
    const product = products.find(p => p.id === parseInt(selectedProductId, 10));
    if (product) {
      addItem(product, parseInt(addQuantity, 10) || 1);
      setSelectedProductId('');
      setAddQuantity(1);
      setGlobalError(null);
    }
  };

  const handleCreateInvoice = async () => {
    setGlobalError(null);
    setReconcilePrompt(false);

    if (!selectedClientId) {
      setGlobalError('Debe seleccionar un cliente.');
      return;
    }

    const availableItems = cartItems.filter(i => !i.isUnavailable);
    if (availableItems.length === 0) {
      setGlobalError('El carrito está vacío o contiene solo artículos no disponibles.');
      return;
    }

    const invoiceData = {
      clientId: parseInt(selectedClientId, 10),
      discount: parseFloat(discount) || 0,
      details: availableItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    };

    const result = await createInvoice(invoiceData);

    if (result.success) {
      clearCart();
      navigate('/invoices');
    } else {
      // If 409 Conflict, it means stock changed
      if (result.parsedError?.status === 409) {
        setReconcilePrompt(true);
        setGlobalError('El inventario ha cambiado desde que agregaste los productos. Revisa tu carrito.');
        // Pull fresh products and reconcile
        await fetchProducts();
        await reconcileCart();
      } else {
        setGlobalError(result.parsedError?.message || 'Error inesperado al crear la factura.');
      }
    }
  };

  const hasUnavailableItems = cartItems.some(i => i.isUnavailable);

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/invoices')} className="btn-outline" style={{ padding: '0.5rem', borderRadius: '50%' }}>
            <ChevronLeft size={20} />
          </button>
          <h1>Nueva Venta</h1>
        </div>
      </div>

      {globalError && (
        <div className="alert alert-error" style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <AlertCircle size={20} />
          <span>{globalError}</span>
        </div>
      )}

      {reconcilePrompt && (
        <div className="alert alert-warning" style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <AlertTriangle size={20} />
          <span>Hemos actualizado las cantidades en tu carrito basado en el inventario actual. Por favor verifica antes de continuar.</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Column: Form & Cart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="data-table-container" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Datos del Cliente</h2>
            <div className="form-group full-width">
              <label>Seleccionar Cliente</label>
              <div className="input-container">
                <select 
                  value={selectedClientId} 
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', padding: '0.6rem 1rem', color: 'var(--text-main)', outline: 'none' }}
                >
                  <option value="">Seleccione un cliente...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.firstName} {c.lastName} ({c.documentType} {c.documentNumber})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="data-table-container" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Agregar Productos</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px auto', gap: '1rem', alignItems: 'end' }}>
              <div className="form-group">
                <label>Producto</label>
                <div className="input-container">
                  <select 
                    value={selectedProductId} 
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    style={{ width: '100%', border: 'none', background: 'transparent', padding: '0.6rem 1rem', color: 'var(--text-main)', outline: 'none' }}
                  >
                    <option value="">Seleccione un producto...</option>
                    {products.filter(p => p.isActive && p.stock > 0).map(p => {
                      return (
                        <option key={p.id} value={p.id}>
                          {p.name} - {formatCurrency(p.unitPrice)} ({p.stock} disponibles)
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Cantidad</label>
                <div className="input-container">
                  <input 
                    type="number" 
                    min="1" 
                    value={addQuantity} 
                    onChange={(e) => setAddQuantity(e.target.value)}
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>
              </div>
              <button 
                onClick={handleAddToCart} 
                disabled={!selectedProductId || addQuantity < 1}
                className="btn-primary" 
                style={{ height: '42px', padding: '0 1.5rem' }}
              >
                <Plus size={18} /> Agregar
              </button>
            </div>
          </div>

          <div className="data-table-container">
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingCart size={20} className="icon-blue" />
              <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Carrito</h2>
            </div>
            {cartItems.length === 0 ? (
              <div className="empty-state">No hay productos en el carrito</div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio Unit.</th>
                      <th style={{ width: '120px' }}>Cantidad</th>
                      <th>Subtotal</th>
                      <th style={{ width: '60px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map(item => {
                      return (
                        <tr key={item.product.id} style={{ opacity: item.isUnavailable ? 0.5 : 1 }}>
                          <td>
                            {item.product.name}
                            {item.isUnavailable && <span style={{ marginLeft: '0.5rem', color: 'var(--danger)', fontSize: '0.8rem', fontWeight: 'bold' }}>Agotado</span>}
                          </td>
                          <td>{formatCurrency(item.product.unitPrice)}</td>
                          <td>
                            <input 
                              type="number" 
                              min="1" 
                              max={item.product.stock}
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value, 10))}
                              disabled={item.isUnavailable}
                              style={{ width: '60px', padding: '0.25rem 0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'var(--bg-secondary)', color: 'var(--text-main)' }}
                            />
                          </td>
                          <td>{formatCurrency(item.product.unitPrice * item.quantity)}</td>
                          <td>
                            <button onClick={() => removeItem(item.product.id)} className="action-btn danger" title="Eliminar">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
        </div>

        {/* Right Column: Totals */}
        <div className="data-table-container" style={{ padding: '1.5rem', position: 'sticky', top: '100px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Resumen de la Venta</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>IVA (19%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>

          <div className="form-group" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
            <label style={{ color: 'var(--text-secondary)' }}>Descuento Global ($)</label>
            <div className="input-container">
              <input 
                type="number" 
                min="0" 
                step="0.01" 
                value={discount} 
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                style={{ paddingLeft: '1rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>

          <button 
            onClick={handleCreateInvoice} 
            disabled={isCreating || cartItems.length === 0 || hasUnavailableItems}
            className="btn-primary full-width"
            style={{ padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center' }}
          >
            {isCreating ? (
              <div className="spinner" style={{ width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
            ) : (
              <><Save size={20} style={{ marginRight: '0.5rem' }} /> Generar Factura</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
