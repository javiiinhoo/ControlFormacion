import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NotFound from './screens/NotFound'; // Importa el componente NotFound
import PasswordChange from './screens/PasswordChange';
import Index from './screens/Index';
import LoginScreen from './screens/LoginScreen';
import LogoutScreen from './screens/LogoutScreen';
import AdminPanelScreen from './screens/AdminPanelScreen';
import Players from './screens/Players';
import PlayerSearchScreen from './screens/PlayerSearchScreen';
import UserManagementScreen from './screens/UserManagementScreen';
import TransferListScreen from './screens/TransferListScreen';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas para las diferentes páginas */}
        <Route exact path="/" element={<Index />} /> {/* Ruta para la página principal */}
        <Route exact path="/login" element={<LoginScreen />} /> {/* Ruta para la pantalla de inicio de sesión */}

        <Route exact path="/logout" element={<LogoutScreen />} /> {/* Ruta para la pantalla de cierre de sesión */}
        <Route exact path="/cambiar-contraseña" element={<PasswordChange />} /> {/* Ruta para la pantalla de cambio de contraseña */}
        <Route exact path="/panel-admin" element={<AdminPanelScreen />} /> {/* Ruta para el panel de administración */}
        <Route exact path="/jugadores" element={<Players />} /> {/* Ruta para la página de jugadores */}
        <Route exact path="/buscar-jugadores" element={<PlayerSearchScreen />} /> {/* Ruta para la pantalla de búsqueda de jugadores */}
        <Route exact path="/gestion-usuarios" element={<UserManagementScreen />} /> {/* Ruta para la pantalla de gestión de usuarios */}
        <Route exact path="/listas-traspasos" element={<TransferListScreen />} /> {/* Ruta para la pantalla de listas de traspasos */}

        {/* Ruta para URLs no encontradas */}
        <Route path="*" element={<NotFound />} /> {/* Ruta para cualquier URL que no coincida con las rutas anteriores */}
      </Routes>
    </Router>
  );
}

export default App;
