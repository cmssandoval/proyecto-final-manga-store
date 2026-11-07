import { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';

const DEMO_USER = {
  name: 'Rodrigo Rodriguez',
  email: 'pfm@gmail.com',
  password: '123',
  phone: '+52 555 123 4567',
  plan: 'Premium Reader',
  avatar: 'PM',
};

const ProfileView = () => {
  const [mode, setMode] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const demoCredentials = useMemo(
    () => `Email: ${DEMO_USER.email} | Contraseña: ${DEMO_USER.password}`,
    [],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (event) => {
    event.preventDefault();

    if (form.email === DEMO_USER.email && form.password === DEMO_USER.password) {
      setIsLoggedIn(true);
      setMessage({
        type: 'success',
        text: 'Sesión iniciada correctamente. Bienvenida de nuevo.',
      });
      return;
    }

    setMessage({
      type: 'error',
      text: 'Credenciales inválidas. Prueba con pfm@gmail.com / 123.',
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setForm({ name: '', email: '', password: '' });
    setMessage({ type: 'info', text: 'Sesión cerrada.' });
  };

  return (
    <main className="profile-page">
      <div className="profile-shell">
        <header className="profile-hero">
          <div className="profile-hero__content">
            <div>
              <p className="profile-eyebrow">Cuenta</p>
              <h1 className="profile-title">Perfil de usuario</h1>
            </div>
            <div className="profile-status">
              {isLoggedIn ? 'Sesión iniciada' : 'Sesión cerrada'}
            </div>
          </div>
        </header>

        <div className="profile-grid">
          <section className="profile-panel profile-panel--summary">
            {isLoggedIn ? (
              <>
                <div className="profile-user">
                  <div className="profile-avatar">
                    {DEMO_USER.avatar}
                  </div>
                  <div>
                    <p className="profile-eyebrow">Bienvenida</p>
                    <h2 className="profile-user__name">{DEMO_USER.name}</h2>
                  </div>
                </div>

                <div className="profile-details">
                  <div className="profile-detail">
                    <p className="profile-detail__label">Email</p>
                    <p className="profile-detail__value">{DEMO_USER.email}</p>
                  </div>
                  <div className="profile-detail">
                    <p className="profile-detail__label">Plan</p>
                    <p className="profile-detail__value">{DEMO_USER.plan}</p>
                  </div>
                  <div className="profile-detail profile-detail--wide">
                    <p className="profile-detail__label">Teléfono</p>
                    <p className="profile-detail__value">{DEMO_USER.phone}</p>
                  </div>
                </div>

                <div className="profile-actions">
                  <button className="profile-button profile-button--primary">
                    Editar perfil
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="profile-button profile-button--secondary"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="profile-intro">
                  <p className="profile-eyebrow">Demo</p>
                  <h2 className="profile-section-title">Sesión no iniciada</h2>
                </div>

                <div className="profile-demo">
                  <p className="profile-demo__description">
                    Para probar la sesión de usuario usa estos datos:
                  </p>
                  <div className="profile-demo__credentials">
                    {demoCredentials}
                  </div>
                </div>
                <div className="profile-register-prompt">
                  <p>¿Aún no tienes una cuenta? <NavLink to="/register">Regístrate</NavLink></p>
                </div>
              </>
            )}
          </section>

          <section className="profile-panel profile-panel--login">
            <div className="profile-tabs">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`profile-tab ${mode === 'login' ? 'profile-tab--active' : ''}`}
              >
                Login
              </button>
            </div>

            {message.text && (
              <div
                className={`profile-message profile-message--${message.type}`}
                role="status"
              >
                {message.text}
              </div>
            )}

            {
              <form onSubmit={handleLogin} className="profile-form">
                <div className="profile-field">
                  <label htmlFor="profile-email" className="profile-field__label">
                    Email
                  </label>
                  <input
                    id="profile-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="pfm@gmail.com"
                    className="profile-field__input"
                  />
                </div>

                <div className="profile-field">
                  <label htmlFor="profile-password" className="profile-field__label">
                    Contraseña
                  </label>
                  <input
                    id="profile-password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="123"
                    className="profile-field__input"
                  />
                </div>

                <button
                  type="submit"
                  className="profile-button profile-button--submit"
                >
                  Iniciar sesión
                </button>
              </form>
            }
          </section>
        </div>
      </div>
    </main>
  );
};

export default ProfileView;
