import { useState, useEffect, useCallback } from 'react';
import { clientService } from '../services/clientService';

export const useClientController = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showingActive, setShowingActive] = useState(true);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const responseData = await clientService.getAllClients(showingActive);
      // Si el backend envuelve la respuesta en { data: [...] } u otro objeto, extraemos el array
      const clientsArray = Array.isArray(responseData) ? responseData : (responseData.data || responseData.items || responseData.result || []);
      setClients(clientsArray);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener los clientes');
      console.error('Error fetching clients:', err);
    } finally {
      setIsLoading(false);
    }
  }, [showingActive]);

  const createClient = async (clientData) => {
    setIsLoading(true);
    setError(null);
    try {
      await clientService.createClient(clientData);
      await fetchClients(); // Refrescar lista completa
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el cliente');
      console.error('Error creating client:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateClient = async (id, clientData) => {
    setIsLoading(true);
    setError(null);
    try {
      await clientService.updateClient(id, clientData);
      await fetchClients(); // Refrescar lista completa
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el cliente');
      console.error('Error updating client:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteClient = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await clientService.deleteClient(id);
      await fetchClients(); // Refrescar lista completa
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al desactivar el cliente');
      console.error('Error deleting client:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const reactivateClient = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await clientService.reactivateClient(id);
      await fetchClients(); // Refrescar lista completa
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al reactivar el cliente');
      console.error('Error reactivating client:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const toggleShowInactive = () => {
    setShowingActive(prev => !prev);
  };

  return {
    clients,
    isLoading,
    error,
    showingActive,
    toggleShowInactive,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    reactivateClient
  };
};
