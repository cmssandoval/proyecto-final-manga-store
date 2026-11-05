import { useState } from "react";
import registerSchema from '../schemas/RegisterSchema.js';
import HeaderMiniBanner from "./HeaderMiniBanner";

const RegisterForm = ({ onSubmitSuccess, isLoading }) => {

  const [ formData, setFormData] = useState({
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
    <div className="bg-[radial-gradient(circle_at_top,_#fffafc_0%,_#f8edf3_25%,_#eef7ff_100%)] px-3 py-5 text-[#2f2432] md:px-6">
      <div className="mx-auto max-w-7xl rounded-[30px] border border-[#f1dfe9] bg-[#fbf7f9]/80 shadow-[0_30px_80px_rgba(178,126,157,0.14)] backdrop-blur-sm">
        <HeaderMiniBanner />
        <div className="bg-[radial-gradient(circle_at_top,_#fffdfd_0%,_#f9edf3_35%,_#eef8ff_100%)] px-4 py-8 text-[#2c2330] md:px-6">
          <h1 className={
            `flex-1 rounded-full mb-5 px-4 py-2 text-xl font-bold text-center uppercase tracking-[0.12em] transition bg-white text-[#382b38] shadow-sm`}
          >
            Register
          </h1>
          {error &&
            <p
              className={`mb-5 px-4 py-2 text-xl font-bold text-center uppercase tracking-[0.12em] transition text-[red]`}
            > {error}</p>
          }
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-[#877683]">
                Nombre
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
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
                value={formData.email}
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
                value={formData.password}
                onChange={handleChange}
                placeholder="Crea una contraseña"
                className="w-full rounded-2xl border border-[#efdfe8] bg-[#fffafc] px-4 py-3 text-sm text-[#382b38] placeholder:text-[#a38b9a] outline-none transition focus:border-[#bfe5ff] focus:ring-2 focus:ring-[#dff3ff]"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-[#877683]">
                Confirme su contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirme su contraseña"
                className="w-full rounded-2xl border border-[#efdfe8] bg-[#fffafc] px-4 py-3 text-sm text-[#382b38] placeholder:text-[#a38b9a] outline-none transition focus:border-[#bfe5ff] focus:ring-2 focus:ring-[#dff3ff]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-[#f7bfd0] px-4 py-3 text-sm font-black uppercase tracking-[0.16em] text-[#382b38] transition hover:bg-[#f2b0c9]"
            >
              {isLoading ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;