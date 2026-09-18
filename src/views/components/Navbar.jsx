import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, UserCheck, ReceiptText, Users, LayoutDashboard, Package } from 'lucide-react';

/**
 * Componente Navbar (Componente Reutilizable - MVC)
 * Muestra el estado de la sesión activa y permite cerrar sesión
 */
export function Navbar({ user, onLogout }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <header className="main-navbar">
      <div className="navbar-brand">
        <ReceiptText className="brand-icon" size={24} />
        <div>
          <span className="brand-name">The Factory HKA</span>
          <span className="brand-tag">POS & Facturación</span>
        </div>
      </div>

      <nav className="navbar-links">
        <Link to="/" className={`nav-link ${isActive('/')}`}>
          <LayoutDashboard size={18} />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>
        <Link to="/clients" className={`nav-link ${isActive('/clients')}`}>
          <Users size={18} />
          <span className="hidden sm:inline">Clientes</span>
        </Link>
        <Link to="/products" className={`nav-link ${isActive('/products')}`}>
          <Package size={18} />
          <span className="hidden sm:inline">Productos</span>
        </Link>
      </nav>

      <div className="navbar-actions">
        <div className="user-pill">
          <UserCheck size={16} className="user-icon" />
          <span className="user-name">{user?.username || 'Usuario'}</span>
          <span className="status-dot" title="Sesión activa"></span>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="btn btn-outline btn-logout"
          title="Cerrar sesión actual"
        >
          <LogOut size={16} />
          <span>Salir</span>
        </button>
      </div>
    </header>
  );
}
