import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario) {
    // No logueado → redirige a login
    return <Navigate to="/login" replace />;
  }

  if (usuario.rol !== 'admin') {
    // Logueado pero no admin → redirige a home
    return <Navigate to="/" replace />;
  }

  // Es admin → muestra la ruta protegida
  return children;
}
