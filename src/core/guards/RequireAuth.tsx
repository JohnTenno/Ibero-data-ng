import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export function RequireAuth() {
  const { isAuthenticated, cargando } = useAuth();
  const location = useLocation();

  if (cargando) {
    return <p className="cargando-sesion">Cargando…</p>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
