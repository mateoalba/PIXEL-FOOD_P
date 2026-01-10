import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/Login';
import Usuarios from './pages/Usuarios';
import PrivateRoute from './auth/PrivateRoute';
import Layout from './components/Layout';
import Roles from './pages/Roles';

function App() {
  return (
    <Routes>

      {/* Redirección inicial */}
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/usuarios"
        element={
          <PrivateRoute>
            <Layout>
            <Usuarios />
            </Layout>
          </PrivateRoute>
        }
      />



            {/* Roles ✅ */}
      <Route
        path="/roles"
        element={
          <PrivateRoute>
            <Layout>
              <Roles />
            </Layout>
          </PrivateRoute>
        }
      />

    </Routes>
  );
}

export default App;
