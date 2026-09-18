export const ClientModel = {
  id: 0,
  documentType: '',
  documentNumber: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  isActive: true
};

export const createClientInstance = (data = {}) => ({
  id: data.id || 0,
  documentType: data.documentType || '',
  documentNumber: data.documentNumber || '',
  firstName: data.firstName || '',
  lastName: data.lastName || '',
  email: data.email || '',
  phone: data.phone || '',
  address: data.address || '',
  isActive: data.isActive !== undefined ? data.isActive : true
});
