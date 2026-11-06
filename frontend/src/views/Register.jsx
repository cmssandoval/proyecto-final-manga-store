import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm.jsx';

const RegisterView = () => {

  const [ isLoading, setIsLoading ] = useState(false);
  const [ apiError, setApiError ] = useState('');

  const navigate = useNavigate();

  const handleRegisterSubmit = async (userData) => {
    setIsLoading(true);
    setApiError('')

    try {
      console.log('Enviando datos al backend:', userData);
      
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulación de espera

      // Reemplazar por modal bonito o sección de errores común
      alert('¡Registro exitoso!');
      navigate('/login'); 
      
    } catch (err) {
      setApiError('El correo ya está registrado o hubo un error en el servidor');
    } finally {
      setIsLoading(false);
    }

  };

  return(
    <>
      {apiError && <div className="api-error">{apiError}</div>}
      <RegisterForm onSubmitSuccess={handleRegisterSubmit} isLoading={isLoading} />
    </>
  );
};

export default RegisterView;