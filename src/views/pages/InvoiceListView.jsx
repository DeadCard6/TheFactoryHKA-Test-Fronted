import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoiceController } from '../../controllers/useInvoiceController';
import { useClientController } from '../../controllers/useClientController';
import { formatCurrency } from '../../lib/formatCurrency';
import { formatDateTime, startOfDayParam, endOfDayParam } from '../../lib/dateUtils';
import { Plus, Eye, Filter } from 'lucide-react';

export const InvoiceListView = () => {
  const navigate = useNavigate();
  const { invoices, fetchInvoices, isLoading } = useInvoiceController();
  const { clients } = useClientController();

  const [filters, setFilters] = useState({
    clientId: '',
    dateFrom: '',
    dateTo: '',
    status: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const apiFilters = { ...filters };
    if (filters.dateFrom) {
      apiFilters.dateFrom = startOfDayParam(filters.dateFrom);
    }
    if (filters.dateTo) {
      apiFilters.dateTo = endOfDayParam(filters.dateTo);
    }
    fetchInvoices(apiFilters);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 0:
      case '0':
      case 'Pending':
        return <span className="status-badge active" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-main)' }}>Pendiente</span>;
      case 1:
      case '1':
      case 'Paid':
        return <span className="status-badge active" style={{ backgroundColor: '#10b981', color: '#fff' }}>Pagada</span>;
      case 2:
      case '2':
      case 'Voided':
        return <span className="status-badge inactive" style={{ backgroundColor: '#ef4444', color: '#fff' }}>Anulada</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Facturación</h1>
        <button className="btn-primary" onClick={() => navigate('/invoices/new')}>
          <Plus size={20} />
          Nueva Venta
        </button>
      </div>

      <div className="data-table-container">
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          
          <div className="form-group">
            <label>Cliente</label>
            <div className="input-container">
              <select 
                name="clientId" 
                value={filters.clientId} 
                onChange={handleFilterChange}
                style={{ width: '100%', border: 'none', background: 'transparent', padding: '0.6rem 1rem', color: 'var(--text-main)', outline: 'none' }}
              >
                <option value="">Todos los clientes</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Desde Fecha</label>
            <div className="input-container">
              <input 
                type="date" 
                name="dateFrom" 
                value={filters.dateFrom} 
                onChange={handleFilterChange}
                style={{ paddingLeft: '1rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Hasta Fecha</label>
            <div className="input-container">
              <input 
                type="date" 
                name="dateTo" 
                value={filters.dateTo} 
                onChange={handleFilterChange}
                style={{ paddingLeft: '1rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Estado</label>
            <div className="input-container">
              <select 
                name="status" 
                value={filters.status} 
                onChange={handleFilterChange}
                style={{ width: '100%', border: 'none', background: 'transparent', padding: '0.6rem 1rem', color: 'var(--text-main)', outline: 'none' }}
              >
                <option value="">Todos</option>
                <option value="0">Pendiente</option>
                <option value="1">Pagada</option>
                <option value="2">Anulada</option>
              </select>
            </div>
          </div>

          <button onClick={applyFilters} className="btn-outline" style={{ height: '42px', display: 'flex', justifyContent: 'center' }}>
            <Filter size={18} style={{ marginRight: '0.5rem' }} /> Filtrar
          </button>
        </div>

        {isLoading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Cargando facturas...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>N° Factura</th>
                  <th>Fecha y Hora</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th style={{ width: '80px', textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                      No se encontraron facturas con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => {
                    return (
                      <tr key={inv.id}>
                        <td style={{ fontWeight: '500' }}>{inv.invoiceNumber || `INV-${inv.id.toString().padStart(6, '0')}`}</td>
                        <td>{formatDateTime(inv.issueDate)}</td>
                        <td>{inv.clientName}</td>
                        <td style={{ fontWeight: '500' }}>
                          {formatCurrency(inv.total)}
                        </td>
                        <td>{getStatusBadge(inv.status)}</td>
                        <td>
                          <div className="action-buttons" style={{ justifyContent: 'center' }}>
                            <button 
                              onClick={() => navigate(`/invoices/${inv.id}`)}
                              className="action-btn"
                              title="Ver detalles"
                            >
                              <Eye size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
