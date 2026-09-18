import { describe, it, expect } from 'vitest';
import { calcTotals, reconcileWithStock } from './cartLogic';

describe('cartLogic', () => {
  describe('calcTotals', () => {
    it('calculates totals correctly for standard integers', () => {
      const lines = [
        { product: { unitPrice: 100 }, quantity: 2, isUnavailable: false },
        { product: { unitPrice: 50 }, quantity: 1, isUnavailable: false },
      ];
      // Subtotal: 200 + 50 = 250
      // Tax: 250 * 0.19 = 47.5 -> 48 (Math.round(47.5) = 48) => wait, Math.round(47.5) is 48. Let's check 250 * 0.19 = 47.5.
      // Wait, 47.5 * 100 = 4750. Math.round(4750) = 4750 / 100 = 47.50
      const totals = calcTotals(lines, 0);
      expect(totals.subtotal).toBe(250);
      expect(totals.tax).toBe(47.5);
      expect(totals.total).toBe(297.5);
    });

    it('ignores unavailable lines', () => {
      const lines = [
        { product: { unitPrice: 100 }, quantity: 2, isUnavailable: false },
        { product: { unitPrice: 50 }, quantity: 1, isUnavailable: true },
      ];
      const totals = calcTotals(lines, 0);
      expect(totals.subtotal).toBe(200);
      expect(totals.tax).toBe(38); // 200 * 0.19 = 38
      expect(totals.total).toBe(238);
    });

    it('rounds 0.50 subtotal to 0.10 tax exactly like SQL Server', () => {
      // 0.50 * 0.19 = 0.095 -> rounded to 2 decimals AwayFromZero -> 0.10
      const lines = [
        { product: { unitPrice: 0.50 }, quantity: 1, isUnavailable: false },
      ];
      const totals = calcTotals(lines, 0);
      expect(totals.subtotal).toBe(0.50);
      expect(totals.tax).toBe(0.10);
      expect(totals.total).toBe(0.60);
    });

    it('rounds 10.01 subtotal to 1.90 tax', () => {
      // 10.01 * 0.19 = 1.9019 -> rounded to 1.90
      const lines = [
        { product: { unitPrice: 10.01 }, quantity: 1, isUnavailable: false },
      ];
      const totals = calcTotals(lines, 0);
      expect(totals.subtotal).toBe(10.01);
      expect(totals.tax).toBe(1.90);
      expect(totals.total).toBe(11.91);
    });

    it('caps the discount at subtotal + tax', () => {
      const lines = [
        { product: { unitPrice: 100 }, quantity: 1, isUnavailable: false },
      ]; // subtotal = 100, tax = 19, total max = 119
      
      const totals = calcTotals(lines, 500); // Attempting to discount 500
      expect(totals.subtotal).toBe(100);
      expect(totals.tax).toBe(19);
      expect(totals.discount).toBe(119);
      expect(totals.total).toBe(0); // Should never be negative
    });
  });

  describe('reconcileWithStock', () => {
    it('marks a line as unavailable if the product was deactivated or deleted', () => {
      const cartItems = [
        { product: { id: 1, name: 'Prod 1' }, quantity: 2, isUnavailable: false }
      ];
      const activeProducts = []; // Product 1 is no longer active
      
      const result = reconcileWithStock(cartItems, activeProducts);
      expect(result).toHaveLength(1);
      expect(result[0].isUnavailable).toBe(true);
      expect(result[0].product.name).toBe('Prod 1'); // Preserved
    });

    it('marks a line as unavailable if stock drops to 0', () => {
      const cartItems = [
        { product: { id: 1, name: 'Prod 1' }, quantity: 2, isUnavailable: false }
      ];
      const activeProducts = [
        { id: 1, name: 'Prod 1', stock: 0 }
      ];
      
      const result = reconcileWithStock(cartItems, activeProducts);
      expect(result[0].isUnavailable).toBe(true);
    });

    it('reduces quantity if stock is lower than requested', () => {
      const cartItems = [
        { product: { id: 1 }, quantity: 5, isUnavailable: false }
      ];
      const activeProducts = [
        { id: 1, stock: 3, unitPrice: 150 }
      ];
      
      const result = reconcileWithStock(cartItems, activeProducts);
      expect(result[0].isUnavailable).toBe(false);
      expect(result[0].quantity).toBe(3);
      expect(result[0].product.unitPrice).toBe(150); // Updates with fresh product
    });

    it('leaves everything as is if stock is sufficient', () => {
      const cartItems = [
        { product: { id: 1 }, quantity: 5, isUnavailable: false }
      ];
      const activeProducts = [
        { id: 1, stock: 10 }
      ];
      
      const result = reconcileWithStock(cartItems, activeProducts);
      expect(result[0].isUnavailable).toBe(false);
      expect(result[0].quantity).toBe(5);
    });
  });
});
