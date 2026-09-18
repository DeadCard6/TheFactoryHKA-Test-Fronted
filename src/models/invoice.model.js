/**
 * Creates an empty invoice detail instance for the frontend forms.
 * @returns {Object}
 */
export const createInvoiceDetailInstance = () => ({
  productId: '',
  quantity: 1,
});

/**
 * Creates an empty invoice instance for the frontend forms.
 * @returns {Object}
 */
export const createInvoiceInstance = () => ({
  clientId: '',
  discount: 0,
  details: [],
});
