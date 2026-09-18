import { useState, useCallback, useEffect } from 'react';
import { invoiceService } from '../services/invoiceService';
import { parseApiError } from '../lib/errorHelper';

export const useInvoiceController = () => {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInvoices = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const responseData = await invoiceService.getAllInvoices(filters);
      const invoicesArray = Array.isArray(responseData) ? responseData : (responseData.data || responseData.items || responseData.result || []);
      setInvoices(invoicesArray);
    } catch (err) {
      const parsedError = parseApiError(err);
      setError(parsedError.message || 'Error al obtener las facturas');
      console.error('Error fetching invoices:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createInvoice = async (invoiceData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await invoiceService.createInvoice(invoiceData);
      await fetchInvoices();
      return { success: true, invoiceId: result.id || result.data?.id };
    } catch (err) {
      const parsedError = parseApiError(err);
      setError(parsedError.message || 'Error al crear la factura');
      console.error('Error creating invoice:', err);
      // Return parsedError so the caller can check for 409 and show the reconcile prompt
      return { success: false, parsedError };
    } finally {
      setIsLoading(false);
    }
  };

  const voidInvoice = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await invoiceService.voidInvoice(id);
      await fetchInvoices();
      return { success: true };
    } catch (err) {
      const parsedError = parseApiError(err);
      setError(parsedError.message || 'Error al anular la factura');
      console.error('Error voiding invoice:', err);
      return { success: false, parsedError };
    } finally {
      setIsLoading(false);
    }
  };

  const getInvoiceById = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await invoiceService.getInvoiceById(id);
      return data;
    } catch (err) {
      const parsedError = parseApiError(err);
      setError(parsedError.message || 'Error al obtener la factura');
      console.error('Error fetching invoice by id:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const payInvoice = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await invoiceService.payInvoice(id);
      await fetchInvoices();
      return { success: true };
    } catch (err) {
      const parsedError = parseApiError(err);
      setError(parsedError.message || 'Error al pagar la factura');
      console.error('Error paying invoice:', err);
      return { success: false, parsedError };
    } finally {
      setIsLoading(false);
    }
  };

  // Optional: auto-fetch on mount
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return {
    invoices,
    isLoading,
    error,
    fetchInvoices,
    getInvoiceById,
    createInvoice,
    voidInvoice,
    payInvoice
  };
};
