import React from 'react';
import { useAuthController } from './controllers/useAuthController';
import { LoginView } from './views/pages/LoginView';
import { Navbar } from './views/components/Navbar';
import { DashboardView } from './views/pages/DashboardView';
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
    <div className="app-layout">
      <Navbar user={authState.user} onLogout={actions.logout} />
      <main className="app-main-content">
        <DashboardView user={authState.user} />
      </main>
    </div>
  );
}

export default App;
