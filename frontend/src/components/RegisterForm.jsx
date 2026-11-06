import { useState } from 'react';
import registerSchema from '../schemas/RegisterSchema.js';
import HeaderMiniBanner from './HeaderMiniBanner.jsx';

const RegisterForm = ({ onSubmitSuccess, isLoading }) => {

  const [ formData, setFormData ] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  });
  const [ error, setError ] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({...prev, [name]: value }));
  };

  const handleRegister = (event) => {

    event.preventDefault();
    setError('');

    const zodParseResult = registerSchema.safeParse(formData);
    if ( !zodParseResult.success ) {
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
    <div className="register-page">
      <div className="register-shell">
        <HeaderMiniBanner />
        <div className="register-card">
          <h1 className="register-title">Register</h1>

          {error && <p className="register-error">{error}</p>}

          <form onSubmit={handleRegister} className="register-form">
            <div className="field-group">
              <label className="field-label">Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tu nombre"
                className="field-input"
              />
            </div>

            <div className="field-group">
              <label className="field-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tucorreo@email.com"
                className="field-input"
              />
            </div>

            <div className="field-group">
              <label className="field-label">Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Crea una contraseña"
                className="field-input"
              />
            </div>

            <div className="field-group">
              <label className="field-label">Confirme su contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirme su contraseña"
                className="field-input"
              />
            </div>

            <button type="submit" disabled={isLoading} className="submit-button">
              {isLoading ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;