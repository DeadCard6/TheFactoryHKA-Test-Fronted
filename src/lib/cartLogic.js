/**
 * Calculates the totals for an invoice/cart using cents-based arithmetic
 * to prevent floating point inaccuracies.
 * 
 * @param {Array} lines - Array of cart items: { product, quantity, isUnavailable }
 * @param {number} discount - Discount applied to the whole invoice
 * @returns {{ subtotal: number, tax: number, discount: number, total: number }}
 */
export const calcTotals = (lines, discount = 0) => {
  let subtotalCents = 0;

  for (const line of lines) {
    // Ignore items that became unavailable due to stock/deactivation
    if (line.isUnavailable) continue;

    // Multiply by 100 and round to avoid trailing float decimals, then multiply by quantity
    const lineSubCents = Math.round(line.product.unitPrice * 100) * line.quantity;
    subtotalCents += lineSubCents;
  }

  const subtotal = subtotalCents / 100;

  // 19% Tax calculation, matching SQL Server / .NET Math.Round(Subtotal * 0.19m, 2, MidpointRounding.AwayFromZero)
  // e.g. 0.50 * 0.19 = 0.095 -> 9.5 -> Math.round(9.5) = 10 -> 0.10
  const taxCents = Math.round((subtotal * 0.19) * 100);
  const tax = taxCents / 100;

  const maxDiscount = subtotal + tax;
  const appliedDiscount = Math.min(Math.max(0, discount), maxDiscount);

  const total = subtotal + tax - appliedDiscount;

  return {
    subtotal,
    tax,
    discount: appliedDiscount,
    total
  };
};

/**
 * Reconciles the local cart against the fresh product list from the server.
 * This handles 409 Conflicts where stock might have changed during checkout.
 * 
 * @param {Array} cartItems - The user's current cart items
 * @param {Array} activeProducts - Fresh list of active products from the API
 * @returns {Array} Updated cart items with `isUnavailable` flags and adjusted quantities
 */
export const reconcileWithStock = (cartItems, activeProducts) => {
  return cartItems.map(item => {
    const freshProduct = activeProducts.find(p => p.id === item.product.id);
    
    // If product was deleted, deactivated, or ran completely out of stock
    if (!freshProduct || freshProduct.stock <= 0) {
      return {
        ...item,
        isUnavailable: true,
        // Do not update the product reference here so the user can still see the name 
        // of what they had in their cart before it disappeared.
      };
    }
    
    // Product exists and has stock > 0
    // Force quantity to fit within new stock limit
    const safeQuantity = Math.min(item.quantity || 1, freshProduct.stock);
    
    return {
      ...item,
      product: freshProduct, // Update product reference to get fresh prices
      quantity: safeQuantity,
      isUnavailable: false
    };
  });
};
