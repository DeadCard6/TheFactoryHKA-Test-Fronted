import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';
import { parseApiError } from '../lib/errorHelper';

export const useProductController = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showingActive, setShowingActive] = useState(true);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const responseData = await productService.getAllProducts(showingActive);
      const productsArray = Array.isArray(responseData) ? responseData : (responseData.data || responseData.items || responseData.result || []);
      setProducts(productsArray);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener los productos');
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  }, [showingActive]);

  const fetchCategories = useCallback(async () => {
    try {
      const responseData = await productService.getAllCategories();
      const categoriesArray = Array.isArray(responseData) ? responseData : (responseData.data || responseData.items || responseData.result || []);
      setCategories(categoriesArray);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  const createProduct = async (productData) => {
    setIsLoading(true);
    setError(null);
    try {
      await productService.createProduct(productData);
      await fetchProducts();
      return { success: true };
    } catch (err) {
      const parsedError = parseApiError(err);
      setError(parsedError.message);
      console.error('Error creating product:', err);
      return { success: false, parsedError };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (id, productData) => {
    setIsLoading(true);
    setError(null);
    try {
      await productService.updateProduct(id, productData);
      await fetchProducts();
      return { success: true };
    } catch (err) {
      const parsedError = parseApiError(err);
      setError(parsedError.message);
      console.error('Error updating product:', err);
      return { success: false, parsedError };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await productService.deleteProduct(id);
      await fetchProducts();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al desactivar el producto');
      console.error('Error deleting product:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const reactivateProduct = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await productService.reactivateProduct(id);
      await fetchProducts();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al reactivar el producto');
      console.error('Error reactivating product:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const toggleShowInactive = () => {
    setShowingActive(prev => !prev);
  };

  return {
    products,
    categories,
    isLoading,
    error,
    showingActive,
    toggleShowInactive,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    reactivateProduct
  };
};
