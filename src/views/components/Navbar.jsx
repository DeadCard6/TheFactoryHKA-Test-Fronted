import React from 'react';
import { LogOut, UserCheck, ReceiptText } from 'lucide-react';

/**
 * Componente Navbar (Componente Reutilizable - MVC)
 * Muestra el estado de la sesión activa y permite cerrar sesión
 */
export function Navbar({ user, onLogout }) {
  return (
    <header className="main-navbar">
      <div className="navbar-brand">
        <ReceiptText className="brand-icon" size={24} />
        <div>
          <span className="brand-name">The Factory HKA</span>
          <span className="brand-tag">POS & Facturación</span>
        </div>
      </div>

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
