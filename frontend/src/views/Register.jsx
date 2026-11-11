import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm.jsx';
import useUserContext from '../hooks/useUserContext.js';

const RegisterView = () => {
  const [ isLoading, setIsLoading ] = useState(false);
  const [ apiError, setApiError ] = useState('');

  const navigate = useNavigate();
  const { register } = useUserContext();

  const handleRegisterSubmit = async (userData) => {
    setIsLoading(true);
    setApiError('');

    try {
      const response = await register(userData);
      alert(response);
      navigate('/login');
    } catch {
      setApiError('No se pudo completar el registro. Inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page" aria-label="Registro de cuenta">
      <div className="auth-page__shell">
        {apiError && <div className="auth-page__error" role="alert">{apiError}</div>}
        <RegisterForm
          onSubmitSuccess={handleRegisterSubmit}
          onFormChange={() => setApiError('')}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
};

export default RegisterView;