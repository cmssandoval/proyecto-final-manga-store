import { Navigate, Outlet } from 'react-router-dom';
import useUserContext from '../hooks/useUserContext.js';

const GuestRoute = () => {
  const { user, loading } = useUserContext();

  if (loading) {
    return <p role="status">Verificando sesión...</p>;
  }

  return user ? <Navigate to="/perfil" replace /> : <Outlet />;
};

export default GuestRoute;
