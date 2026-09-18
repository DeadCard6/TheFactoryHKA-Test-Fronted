import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthController } from './controllers/useAuthController';
import { LoginView } from './views/pages/LoginView';
import { Navbar } from './views/components/Navbar';
import { DashboardView } from './views/pages/DashboardView';
import { ClientListView } from './views/pages/ClientListView';
import { ProductListView } from './views/pages/ProductListView';
import './App.css';

/**
 * Componente Raíz - Orquestador MVC
 * Enlaza los Controladores con las Vistas según el estado de la aplicación
 */
function App() {
  const { authState, actions } = useAuthController();

  // Si no está autenticado, renderiza la vista de Login
  if (!authState.isAuthenticated) {
    return <LoginView authState={authState} actions={actions} />;
  }

  // Vista autenticada con Navbar y contenido principal
  return (
    <Router>
      <div className="app-layout min-h-screen bg-gray-50 flex flex-col">
        <Navbar user={authState.user} onLogout={actions.logout} />
        <main className="app-main-content flex-1 p-6">
          <Routes>
            <Route path="/" element={<DashboardView user={authState.user} />} />
            <Route path="/clients" element={<ClientListView />} />
            <Route path="/products" element={<ProductListView />} />
            {/* Fallback to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
