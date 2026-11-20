import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useUserContext from '../hooks/useUserContext.js';

const ProtectedRoute = ({ requiredRole }) => {
  const { user, loading } = useUserContext();
  const location = useLocation();

  if (loading) {
    return <p role="status">Verificando sesión...</p>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasRequiredRole = Array.isArray(user.roles) && user.roles.includes(requiredRole);
  if (requiredRole && !hasRequiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;