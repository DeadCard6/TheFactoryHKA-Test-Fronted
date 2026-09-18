import { useState, useMemo, useCallback } from 'react';
import { calcTotals, reconcileWithStock } from '../lib/cartLogic';
import { productService } from '../services/productService';

export const useCartController = () => {
  const [cartItems, setCartItems] = useState([]);
  const [discount, setDiscount] = useState(0);

  const addItem = useCallback((product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock), isUnavailable: false }
            : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock), isUnavailable: false }];
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    setCartItems(prev => prev.map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity: Math.min(quantity, item.product.stock) };
      }
      return item;
    }));
  }, []);

  const removeItem = useCallback((productId) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setDiscount(0);
  }, []);

  const reconcileCart = useCallback(async () => {
    if (cartItems.length === 0) return;
    
    try {
      // Get fresh active products
      const activeProducts = await productService.getAllProducts(true);
      const items = Array.isArray(activeProducts) ? activeProducts : (activeProducts.data || activeProducts.items || activeProducts.result || []);
      
      setCartItems(prev => reconcileWithStock(prev, items));
    } catch (err) {
      console.error('Failed to reconcile cart with stock:', err);
    }
  }, [cartItems.length]);

  const totals = useMemo(() => {
    return calcTotals(cartItems, discount);
  }, [cartItems, discount]);

  return {
    cartItems,
    discount,
    setDiscount,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    reconcileCart,
    ...totals
  };
};
