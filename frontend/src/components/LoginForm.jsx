import { useState } from 'react';
import loginSchema from '../schemas/LoginSchema.js';
import { NavLink } from 'react-router-dom';

import '../styles/auth-form.css';

const LoginForm = ({ onSubmitSuccess, onFormChange, isLoading }) => {

  const [formData, setFormData] = useState({
    email: '', password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    onFormChange();
  };

  const handleLogin = (event) => {

    event.preventDefault();
    setError('');

    const zodParseResult = loginSchema.safeParse(formData);
    if (!zodParseResult.success) {
      setError(zodParseResult.error.issues[0].message);
      return;
    }

    onSubmitSuccess(formData);
  };

  return (
    <section className="main-container">
      <div className="glow glow-right" />
      <div className="glow glow-left" />

      <div className="internal-container">
        <div>
          <h1 className="title">Inicia sesión</h1>
        </div>
        <div className='auth-form-shell'>
          {error && <p className="auth-form-error">{error}</p>}
          <form onSubmit={handleLogin} className="auth-form">

            <div className="field-group">
              <label htmlFor='login-email' className="field-label">Email</label>
              <input
                id='login-email'
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tucorreo@email.com"
                className="field-input"
              />
            </div>

            <div className="field-group">
              <label htmlFor='login-password' className="field-label">Contraseña</label>
              <input
                id='login-password'
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
                className="field-input"
              />
            </div>

            <button type="submit" disabled={isLoading} className="button primary">
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
            <div className='bottom-text'>
              <p>¿Aún no tienes una cuenta?<br />
                <span className='font-semibold underline'>
                  <NavLink to={'/register'} >Regístrate</NavLink>
                </span>
              </p>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
};

export default LoginForm;
