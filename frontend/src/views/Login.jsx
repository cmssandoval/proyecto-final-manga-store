import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm.jsx';

const LoginView = () => {

  const [ isLoading, setIsLoading ] = useState(false);
  const [ apiError, setApiError ] = useState('');

  const navigate = useNavigate();

  const handleLoginSubmit = async (userData) => {
    setIsLoading(true);
    setApiError('')

    try {
      console.log('Enviando datos al backend:', userData);
      
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulación de espera

      // Reemplazar por modal bonito o sección de errores común
      alert('Inicio de sesión exitoso!');
      navigate('/profile'); 
      
    } catch (err) {
      setApiError('El correo ya está registrado o hubo un error en el servidor');
    } finally {
      setIsLoading(false);
    }

  };

  return(
    <main className="auth-page" aria-label="Inicio de sesión">
      <div className="auth-page__shell">
        {apiError && <div className="auth-page__error" role="alert">{apiError}</div>}
        <LoginForm onSubmitSuccess={handleLoginSubmit} isLoading={isLoading} />
      </div>
    </main>
  );
};

export default LoginView;