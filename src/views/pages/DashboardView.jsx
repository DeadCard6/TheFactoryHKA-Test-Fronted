import React from 'react';
import { ShieldCheck, ShoppingCart, Users, PackageCheck } from 'lucide-react';

/**
 * Vista de Bienvenida tras Autenticación (MVC)
 * Muestra el estado del token JWT y prepara la navegación a los siguientes módulos
 */
export function DashboardView({ user }) {
  const token = localStorage.getItem('token');
  const tokenPreview = token
    ? `${token.substring(0, 18)}...${token.substring(token.length - 10)}`
    : 'No disponible';

  return (
    <div className="dashboard-container">
      <div className="welcome-banner">
        <div className="welcome-content">
          <h2>¡Bienvenido, {user?.username}! 👋</h2>
          <p>
            Has iniciado sesión correctamente en el sistema de facturación. Tu sesión cuenta con un
            token <strong>JWT Bearer</strong> válido para consumir los servicios protegidos de la API.
          </p>
          <div className="jwt-pill">
            <ShieldCheck size={16} className="jwt-icon" />
            <span>Token JWT Activo: <code>{tokenPreview}</code></span>
          </div>
        </div>
      </div>

      <div className="modules-preview-grid">
        <div className="module-card pending">
          <div className="card-header">
            <Users size={20} className="card-icon" />
            <span className="badge">Siguiente Módulo</span>
          </div>
          <h3>Clientes & Productos</h3>
          <p>Consulta de catálogo con stock en tiempo real y selector de clientes para ventas.</p>
        </div>

        <div className="module-card pending">
          <div className="card-header">
            <ShoppingCart size={20} className="card-icon" />
            <span className="badge">Módulo 3</span>
          </div>
          <h3>Punto de Venta (POS)</h3>
          <p>Carrito de compras, cálculo de IVA en vivo y emisión de factura formal.</p>
        </div>

        <div className="module-card pending">
          <div className="card-header">
            <PackageCheck size={20} className="card-icon" />
            <span className="badge">Módulo 4 & 5</span>
          </div>
          <h3>Historial & Facturas</h3>
          <p>Consulta de ventas pasadas, impresión de comprobante y anulación de factura.</p>
        </div>
      </div>
    </div>
  );
}
