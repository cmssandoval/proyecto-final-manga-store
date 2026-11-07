import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useUserContext from '../hooks/useUserContext.js';

const ProtectedRoute = () => {
  const { user, loading } = useUserContext();
  const location = useLocation();

  if (loading) {
    return <p role="status">Verificando sesión...</p>;
  }

  return user
    ? <Outlet />
    : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;