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
      navigate(location.state?.from?.pathname || '/perfil', { replace: true });
    } catch (error) {
      setApiError(
        error.response?.data?.message
          || 'No se pudo iniciar sesión. Revisa tus credenciales e inténtalo nuevamente.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page" aria-label="Inicio de sesión">
      <div className="auth-page__shell">
        {apiError && <div className="auth-page__error" role="alert">{apiError}</div>}
        <LoginForm onSubmitSuccess={handleLoginSubmit} isLoading={isLoading} />
      </div>
    </main>
  );
};

export default LoginView;