import { useState } from 'react';
import registerSchema from '../schemas/RegisterSchema.js';
import { NavLink } from 'react-router-dom';

import '../styles/AuthForm.css';

const RegisterForm = ({ onSubmitSuccess, isLoading }) => {

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    //? Considerar redireccionamiento programático desde register view,
    //? al hacer eso se desmonta el componente y formData da igual
    //? ya que se limpiaría por si solo en caso de volver a montarse.
    //* setForm({ name: '', email: '', password: '' }); *//
  };

  return (
    <section className="main-container">
      <div className="glow glow-right" />
      <div className="glow glow-left" />

      <div className="internal-container">
        <div>
          <h1 className="title">Regístrate</h1>
        </div>
        <div className='auth-form-shell'>
          {error && <p className="auth-form-error">{error}</p>}
          <form onSubmit={handleRegister} className="auth-form">
            <div className="field-group">
              <label htmlFor='register-name' className="field-label">Nombre</label>
              <input
                id='register-name'
                type="text"
                name="name"
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