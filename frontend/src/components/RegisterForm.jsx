import { useState } from 'react';
import registerSchema from '../schemas/RegisterSchema.js';
import { NavLink } from 'react-router-dom';

import '../styles/auth-form.css';

const RegisterForm = ({ onSubmitSuccess, apiError, onFormChange, isLoading }) => {

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    onFormChange();
  };

  const handleRegister = (event) => {

    event.preventDefault();
    setError('');

    const zodParseResult = registerSchema.safeParse(formData);
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
          <h1 className="title">Regístrate</h1>
        </div>
        <div>
          {(!error && apiError) && <div className="auth-page__error" role="alert">{apiError}</div>}
          {(!apiError && error) && <div className="auth-page__error">{error}</div>}
        </div>
        <div className='auth-form-shell'>
          <form onSubmit={handleRegister} className="auth-form">
            <div className="field-group">
              <label htmlFor='register-name' className="field-label">Nombre</label>
              <input
                id='register-name'
                type="text"
                name="name"
                autoComplete='name'
                value={formData.name}
                onChange={handleChange}
                placeholder="Tu nombre"
                className="field-input"
              />
            </div>

            <div className="field-group">
              <label htmlFor='register-email' className="field-label">Email</label>
              <input
                id='register-email'
                type="email"
                name="email"
                autoComplete='email'
                value={formData.email}
                onChange={handleChange}
                placeholder="tucorreo@email.com"
                className="field-input"
              />
            </div>

            <div className="field-group">
              <label htmlFor='register-password' className="field-label">Contraseña</label>
              <input
                id='register-password'
                type="password"
                name="password"
                autoComplete='new-password'
                value={formData.password}
                onChange={handleChange}
                placeholder="Crea una contraseña"
                className="field-input"
              />
            </div>

            <div className="field-group">
              <label htmlFor='register-confirm-password' className="field-label">Confirme su contraseña</label>
              <input
                id='register-confirm-password'
                type="password"
                name="confirmPassword"
                autoComplete='new-password'
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirme su contraseña"
                className="field-input"
              />
            </div>

            <button type="submit" disabled={isLoading} className="button primary">
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>
            <div className='bottom-text'>
              <p>¿Ya tienes una cuenta?<br />
                <span className='font-semibold underline'>
                  <NavLink to={'/login'} >Inicia Sesión</NavLink>
                </span>
              </p>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
};

export default RegisterForm;