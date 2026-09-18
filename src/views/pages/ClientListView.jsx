import React, { useState } from 'react';
import { useClientController } from '../../controllers/useClientController';
import { ClientFormModal } from '../components/ClientFormModal';
import { Users, Plus, Pencil, Search, AlertCircle, Archive, ArchiveRestore, Eye, EyeOff } from 'lucide-react';

export const ClientListView = () => {
  const { 
    clients, isLoading, error, showingActive, 
    toggleShowInactive, createClient, updateClient, deleteClient, reactivateClient 
  } = useClientController();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenCreate = () => {
    setEditingClient(null);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client) => {
    setEditingClient(client);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleOpenView = (client) => {
    setEditingClient(client);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas desactivar (archivar) este cliente?')) {
      await deleteClient(id);
    }
  };

  const handleReactivate = async (client) => {
    if (window.confirm('¿Estás seguro de que deseas reactivar este cliente?')) {
      await reactivateClient(client.id);
    }
  };

  const handleSave = async (clientData) => {
    let success = false;
    if (editingClient) {
      success = await updateClient(editingClient.id, clientData);
    } else {
      success = await createClient(clientData);
    }
    
    if (success) {
      setIsModalOpen(false);
    }
  };

  const safeClients = Array.isArray(clients) ? clients : [];
  const filteredClients = safeClients.filter(c => {
    const nameStr = `${c?.firstName || ''} ${c?.lastName || ''}`.trim();
    const idStr = c?.documentNumber || '';
    return nameStr.toLowerCase().includes(searchTerm.toLowerCase()) || 
           idStr.includes(searchTerm);
  });

  return (
    <div>
      {/* Header */}
      <div className="clients-header">
        <div>
          <h1 className="clients-title">
            <Users size={28} />
            {showingActive ? 'Gestión de Clientes' : 'Clientes Inactivos'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            {showingActive 
              ? 'Administra la información de tus clientes y contactos.' 
              : 'Lista de clientes que han sido desactivados (archivados).'}
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
              Nuevo Cliente
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
          placeholder="Buscar por nombre o identificación..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Identificación</th>
              <th>Contacto</th>
              <th style={{ textAlign: 'center' }}>Estado</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && clients.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <div className="spinner" style={{ width: '24px', height: '24px', border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
                    Cargando clientes...
                  </div>
                </td>
              </tr>
            ) : filteredClients.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  {showingActive ? 'No se encontraron clientes activos.' : 'No hay clientes inactivos.'}
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr key={client.id} style={{ opacity: client.isActive ? 1 : 0.6 }}>
                  <td>
                    <div className="client-name">{client.firstName} {client.lastName}</div>
                  </td>
                  <td>
                    <div className="client-id">{client.documentType} {client.documentNumber}</div>
                  </td>
                  <td>
                    <div className="client-contact">
                      <div>{client.email}</div>
                      <div style={{ color: 'var(--text-light)' }}>{client.phone}</div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: client.isActive ? 'var(--primary-light)' : '#f1f5f9',
                      color: client.isActive ? 'var(--primary)' : 'var(--text-light)'
                    }}>
                      {client.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        onClick={() => handleOpenView(client)}
                        className="btn-icon"
                        title="Ver Detalles"
                      >
                        <Eye size={18} />
                      </button>
                      
                      <button
                        onClick={() => handleOpenEdit(client)}
                        className="btn-icon"
                        title="Editar"
                        disabled={!client.isActive}
                        style={{ opacity: !client.isActive ? 0.5 : 1, cursor: !client.isActive ? 'not-allowed' : 'pointer' }}
                      >
                        <Pencil size={18} />
                      </button>
                      
                      {client.isActive ? (
                        <button
                          onClick={() => handleDelete(client.id)}
                          className="btn-icon delete"
                          title="Desactivar (Archivar)"
                        >
                          <Archive size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReactivate(client)}
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

      <ClientFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingClient}
        isLoading={isLoading}
        isViewMode={isViewMode}
      />
    </div>
  );
};
