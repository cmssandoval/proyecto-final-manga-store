import { useMemo, useState } from 'react';

const DEMO_USER = {
  name: 'Pia Mendez',
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

  const handleRegister = (event) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.password) {
      setMessage({
        type: 'error',
        text: 'Completa todos los campos para crear tu cuenta.',
      });
      return;
    }

    setMode('login');
    setForm({ name: '', email: '', password: '' });
    setMessage({
      type: 'success',
      text: 'Registro simulado con éxito. Ya puedes iniciar sesión.',
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setForm({ name: '', email: '', password: '' });
    setMessage({ type: 'info', text: 'Sesión cerrada.' });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fffdfd_0%,_#f9edf3_35%,_#eef8ff_100%)] px-4 py-8 text-[#2c2330] md:px-6">
      <div className="mx-auto max-w-6xl rounded-[32px] border border-[#f0dfe9] bg-white/70 p-4 shadow-[0_26px_80px_rgba(183,135,166,0.14)] backdrop-blur-sm md:p-6">
        <header className="mb-6 rounded-[24px] bg-gradient-to-r from-[#fff1f7] via-[#f8f7ff] to-[#edf8ff] px-5 py-6 shadow-inner">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#9a7890]">Cuenta</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-[#31263b]">Perfil de usuario</h1>
            </div>
            <div className="rounded-full border border-[#efd6e3] bg-white/80 px-4 py-2 text-sm font-semibold text-[#5a4a5d] shadow-sm">
              {isLoggedIn ? 'Sesión iniciada' : 'Sesion cerrada'}
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-[#f1dfe8] bg-[#fffafc] p-5 shadow-[0_20px_40px_rgba(183,135,166,0.07)]">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-4 border-b border-[#f0dde7] pb-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#f8bfd2] via-[#f4e7af] to-[#cfeeff] text-lg font-black text-[#403246] shadow-md">
                    {DEMO_USER.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8f7c8b]">Bienvenida</p>
                    <h2 className="mt-1 text-2xl font-black text-[#32253c]">{DEMO_USER.name}</h2>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[22px] border border-[#f0dfe8] bg-white p-4 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8f7c8b]">Email</p>
                    <p className="mt-2 text-base font-semibold text-[#2d2434]">{DEMO_USER.email}</p>
                  </div>
                  <div className="rounded-[22px] border border-[#f0dfe8] bg-white p-4 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8f7c8b]">Plan</p>
                    <p className="mt-2 text-base font-semibold text-[#2d2434]">{DEMO_USER.plan}</p>
                  </div>
                  <div className="rounded-[22px] border border-[#f0dfe8] bg-white p-4 shadow-sm md:col-span-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8f7c8b]">Teléfono</p>
                    <p className="mt-2 text-base font-semibold text-[#2d2434]">{DEMO_USER.phone}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="rounded-full bg-[#f7bfd0] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[#382b38] shadow-[0_12px_20px_rgba(247,191,208,0.38)] transition hover:-translate-y-0.5">
                    Editar perfil
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-full border border-[#dfeefc] bg-[#edf8ff] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[#324d68] transition hover:bg-[#e2f3ff]"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#9a7890]">Demo</p>
                  <h2 className="mt-2 text-2xl font-black text-[#30253b]">Sesión no iniciada</h2>
                </div>

                <div className="rounded-[24px] border border-[#f0dfe6] bg-gradient-to-br from-[#fff7fb] to-[#f0f9ff] p-4 shadow-inner">
                  <p className="text-sm text-[#5c4b5f]">
                    Para probar la sesión de usuario usa estos datos:
                  </p>
                  <div className="mt-3 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[#4d3b4c] shadow-sm">
                    {demoCredentials}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="rounded-[28px] border border-[#efdfe8] bg-[#fffdfd] p-5 shadow-[0_20px_40px_rgba(183,135,166,0.07)]">
            <div className="mb-5 flex rounded-full border border-[#eed7e4] bg-[#f8f0f5] p-1">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] transition ${
                  mode === 'login' ? 'bg-white text-[#382b38] shadow-sm' : 'text-[#74667a]'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] transition ${
                  mode === 'register' ? 'bg-white text-[#382b38] shadow-sm' : 'text-[#74667a]'
                }`}
              >
                Register
              </button>
            </div>

            {message.text && (
              <div
                className={`mb-4 rounded-2xl border px-3 py-2 text-sm font-medium ${
                  message.type === 'success'
                    ? 'border-[#cfeeff] bg-[#eef9ff] text-[#2d5168]'
                    : message.type === 'error'
                      ? 'border-[#f7dfe4] bg-[#fff2f6] text-[#7d4959]'
                      : 'border-[#f0e3d0] bg-[#fffaf0] text-[#6d5d3d]'
                }`}
              >
                {message.text}
              </div>
            )}

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-[#877683]">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="pfm@gmail.com"
                    className="w-full rounded-2xl border border-[#efdfe8] bg-[#fffafc] px-4 py-3 text-sm text-[#382b38] placeholder:text-[#a38b9a] outline-none transition focus:border-[#bfe5ff] focus:ring-2 focus:ring-[#dff3ff]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-[#877683]">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="123"
                    className="w-full rounded-2xl border border-[#efdfe8] bg-[#fffafc] px-4 py-3 text-sm text-[#382b38] placeholder:text-[#a38b9a] outline-none transition focus:border-[#bfe5ff] focus:ring-2 focus:ring-[#dff3ff]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-[#cfeeff] px-4 py-3 text-sm font-black uppercase tracking-[0.16em] text-[#24384d] transition hover:bg-[#bfe8ff]"
                >
                  Iniciar sesión
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-[#877683]">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    className="w-full rounded-2xl border border-[#efdfe8] bg-[#fffafc] px-4 py-3 text-sm text-[#382b38] placeholder:text-[#a38b9a] outline-none transition focus:border-[#bfe5ff] focus:ring-2 focus:ring-[#dff3ff]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-[#877683]">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="tucorreo@email.com"
                    className="w-full rounded-2xl border border-[#efdfe8] bg-[#fffafc] px-4 py-3 text-sm text-[#382b38] placeholder:text-[#a38b9a] outline-none transition focus:border-[#bfe5ff] focus:ring-2 focus:ring-[#dff3ff]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-[#877683]">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Crea una contraseña"
                    className="w-full rounded-2xl border border-[#efdfe8] bg-[#fffafc] px-4 py-3 text-sm text-[#382b38] placeholder:text-[#a38b9a] outline-none transition focus:border-[#bfe5ff] focus:ring-2 focus:ring-[#dff3ff]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-[#f7bfd0] px-4 py-3 text-sm font-black uppercase tracking-[0.16em] text-[#382b38] transition hover:bg-[#f2b0c9]"
                >
                  Crear cuenta
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
