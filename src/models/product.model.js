/**
 * Factory function para crear un nuevo producto con valores por defecto.
 * Mapea directamente a las propiedades requeridas por el backend en CreateProductRequest:
 * Code, Name, Description, CategoryId, UnitPrice, Stock
 */
export const createProductInstance = () => ({
  code: '',
  name: '',
  description: '',
  categoryId: '', // En el backend es int, pero lo inicializamos vacío para que el usuario seleccione
  unitPrice: '',
  stock: '',
  isActive: true
});
