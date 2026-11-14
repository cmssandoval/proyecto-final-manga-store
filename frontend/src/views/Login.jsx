import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm.jsx';
import useUserContext from '../hooks/useUserContext.js';

const LoginView = () => {
  const [ isLoading, setIsLoading ] = useState(false);
  const [ apiError, setApiError ] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUserContext();

  const handleLoginSubmit = async (userData) => {
    setIsLoading(true);
    setApiError('');

    try {
      await login(userData);
      alert('¡Inicio de sesión exitoso!');
      navigate(location.state?.from?.pathname || '/perfil', { replace: true });
    } catch (error) {
      setApiError(
        error.response?.data?.message
          || error.message
          || 'No se pudo iniciar sesión. Revisa tus credenciales e inténtalo nuevamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page" aria-label="Inicio de sesión">
      <div className="auth-page__shell">
        <LoginForm
          onSubmitSuccess={handleLoginSubmit}
          onFormChange={() => setApiError('')}
          apiError={apiError}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
};

export default LoginView;