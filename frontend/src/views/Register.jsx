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
    } catch (error) {
      const message = error.message || 'No se pudo completar el registro. Inténtalo nuevamente.'
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page" aria-label="Registro de cuenta">
      <div className="auth-page__shell">
        <RegisterForm
          onSubmitSuccess={handleRegisterSubmit}
          onFormChange={() => setApiError('')}
          apiError={apiError}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
};

export default RegisterView;