import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoiceController } from '../../controllers/useInvoiceController';
import { formatCurrency } from '../../lib/formatCurrency';
import { formatDateTime } from '../../lib/dateUtils';
import { ChevronLeft, CheckCircle, XCircle, FileText, AlertCircle } from 'lucide-react';

export const InvoiceDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getInvoiceById, payInvoice, voidInvoice, isLoading, error } = useInvoiceController();
  
  const [invoice, setInvoice] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  const loadInvoice = async () => {
    setFetchError(null);
    const data = await getInvoiceById(id);
    if (data) {
      setInvoice(data);
    } else {
      setFetchError('No se pudo cargar la factura o no existe.');
    }
  };

  useEffect(() => {
    loadInvoice();
  }, [id, getInvoiceById]);

  const handlePay = async () => {
    if (window.confirm('¿Está seguro de que desea marcar esta factura como pagada?')) {
      const result = await payInvoice(id);
      if (result.success) {
        await loadInvoice();
      }
    }
  };

  const handleVoid = async () => {
    if (window.confirm('¿Está seguro de que desea ANULAR esta factura? Esta acción no se puede deshacer.')) {
      const result = await voidInvoice(id);
      if (result.success) {
        await loadInvoice();
      }
    }
  };

  if (isLoading && !invoice) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (fetchError || (!isLoading && !invoice)) {
    return (
      <div className="page-container">
        <div className="alert alert-error" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <AlertCircle size={20} />
          <span>{fetchError || 'Factura no encontrada'}</span>
        </div>
        <button onClick={() => navigate('/invoices')} className="btn-primary" style={{ marginTop: '1rem' }}>Volver</button>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 0:
      case '0':
      case 'Pending':
        return <span className="status-badge active" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '1rem', padding: '0.4rem 0.8rem' }}>Pendiente</span>;
      case 1:
      case '1':
      case 'Paid':
        return <span className="status-badge active" style={{ backgroundColor: '#10b981', color: '#fff', fontSize: '1rem', padding: '0.4rem 0.8rem' }}>Pagada</span>;
      case 2:
      case '2':
      case 'Voided':
        return <span className="status-badge inactive" style={{ backgroundColor: '#ef4444', color: '#fff', fontSize: '1rem', padding: '0.4rem 0.8rem' }}>Anulada</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  // Determine if it's pending (assuming 0 is pending)
  const isPending = invoice.status === 0 || invoice.status === '0' || invoice.status === 'Pending';

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/invoices')} className="btn-outline" style={{ padding: '0.5rem', borderRadius: '50%' }}>
            <ChevronLeft size={20} />
          </button>
          <h1>Detalle de Factura {invoice.invoiceNumber || `INV-${invoice.id.toString().padStart(6, '0')}`}</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {getStatusBadge(invoice.status)}
          
          {isPending && (
            <>
              <button onClick={handlePay} disabled={isLoading} className="btn-primary" style={{ backgroundColor: '#10b981', border: 'none' }}>
                <CheckCircle size={18} /> Pagar
              </button>
              <button onClick={handleVoid} disabled={isLoading} className="btn-primary" style={{ backgroundColor: '#ef4444', border: 'none' }}>
                <XCircle size={18} /> Anular
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Column: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="data-table-container" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Información General</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Cliente</p>
                <p style={{ fontWeight: '500', fontSize: '1.1rem' }}>{invoice.clientName}</p>
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Fecha de Emisión</p>
                <p style={{ fontWeight: '500', fontSize: '1.1rem' }}>{formatDateTime(invoice.issueDate)}</p>
              </div>
            </div>
          </div>

          <div className="data-table-container">
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} className="icon-blue" />
              <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Líneas de Factura</h2>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th style={{ textAlign: 'right' }}>Cantidad</th>
                    <th style={{ textAlign: 'right' }}>Precio Unit.</th>
                    <th style={{ textAlign: 'right' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.details && invoice.details.length > 0 ? (
                    invoice.details.map(detail => {
                      return (
                        <tr key={detail.id}>
                          <td>{detail.productName}</td>
                          <td style={{ textAlign: 'right' }}>{detail.quantity}</td>
                          <td style={{ textAlign: 'right' }}>{formatCurrency(detail.unitPrice)}</td>
                          <td style={{ textAlign: 'right' }}>{formatCurrency(detail.subtotal)}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No hay detalles para esta factura.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>

        {/* Right Column: Totals */}
        <div className="data-table-container" style={{ padding: '1.5rem', position: 'sticky', top: '100px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Resumen</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
            <span>{formatCurrency(invoice.subtotal)}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>IVA (19%)</span>
            <span>{formatCurrency(invoice.tax)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Descuento</span>
            <span>-{formatCurrency(invoice.discount)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
            <span>Total</span>
            <span>{formatCurrency(invoice.total)}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
