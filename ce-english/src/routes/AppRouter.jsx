import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Clases from '../pages/Clases.jsx';
import Asistencia from '../pages/Asistencia.jsx';
import Perfil from '../pages/Perfil.jsx';
import Reportes from '../pages/Reportes.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clases"
        element={
          <ProtectedRoute>
            <Clases />
          </ProtectedRoute>
        }
      />
      <Route
        path="/asistencia"
        element={
          <ProtectedRoute>
            <Asistencia />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reportes"
        element={
          <ProtectedRoute>
            <Reportes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
