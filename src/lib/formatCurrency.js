const f0 = new Intl.NumberFormat('es-CO', { 
  style: 'currency', 
  currency: 'COP', 
  minimumFractionDigits: 0, 
  maximumFractionDigits: 0 
});

const f2 = new Intl.NumberFormat('es-CO', { 
  style: 'currency', 
  currency: 'COP', 
  minimumFractionDigits: 2, 
  maximumFractionDigits: 2 
});

/**
 * Format a number to Colombian Peso (COP) currency string.
 * Uses intelligent formatting: no decimals for whole numbers, 2 decimals if cents exist.
 * @param {number} n The number to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (n) => {
  if (typeof n !== 'number') return '$ 0';
  return (Number.isInteger(n) ? f0 : f2).format(n);
};
