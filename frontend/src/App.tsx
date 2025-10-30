import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { PrivateRoute } from './components/PrivateRoute';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/auth/LoginPage';
import { AlunoDashboard } from './pages/aluno/Dashboard';
import { Catalogo } from './pages/aluno/Catalogo';
import { ProfessorDashboard } from './pages/professor/Dashboard';
import { Exercicios } from './pages/professor/Exercicios';
import { Treinos } from './pages/professor/Treinos';
import { AdminDashboard } from './pages/admin/Dashboard';
import { Usuarios } from './pages/admin/Usuarios';

function App() {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route
          path="/aluno/*"
          element={
            <PrivateRoute allowedRoles={['ALUNO']}>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<AlunoDashboard />} />
          <Route path="catalogo" element={<Catalogo />} />
          <Route path="meus-treinos" element={<div>Meus Treinos (em desenvolvimento)</div>} />
        </Route>

        <Route
          path="/professor/*"
          element={
            <PrivateRoute allowedRoles={['PROFESSOR']}>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<ProfessorDashboard />} />
          <Route path="exercicios" element={<Exercicios />} />
          <Route path="treinos" element={<Treinos />} />
        </Route>

        <Route
          path="/admin/*"
          element={
            <PrivateRoute allowedRoles={['ADM']}>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="professores" element={<div>Professores (em desenvolvimento)</div>} />
          <Route path="treinos" element={<div>Treinos (em desenvolvimento)</div>} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/unauthorized" element={<div className="p-8">Acesso não autorizado</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
