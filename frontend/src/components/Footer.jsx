import { Link } from 'react-router-dom';

const footerLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Catálogo', to: '/' },
  { label: 'Colecciones', to: '/' },
  { label: 'Mi cuenta', to: '/perfil' },
];

const infoLinks = [
  { label: 'Envíos', to: '/' },
  { label: 'Devoluciones', to: '/' },
  { label: 'Garantía', to: '/' },
  { label: 'Contacto', to: '/' },
];

const socials = ['Instagram', 'X', 'TikTok'];

const Footer = () => {
  return (
    <footer className="mt-12 border-t border-pink-100 bg-gradient-to-br from-pink-50 via-white to-sky-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.2fr]">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-200 via-pink-100 to-sky-100 text-base font-black text-slate-800 shadow-sm">
                M
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">Manga</p>
                <p className="text-lg font-black tracking-[-0.05em] text-slate-800">MoonShelf</p>
              </div>
            </div>

            <p className="max-w-sm text-sm leading-6 text-slate-600">
              Encuentra ediciones premium, clásicos inolvidables y lanzamientos exclusivos para cada fan del manga.
            </p>

            <div className="mt-5 flex gap-3">
              {socials.map((item) => (
                <a
                  key={item}
                  href="#"
                  aria-label={item}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-pink-200 bg-white text-xs font-bold text-slate-700 transition hover:border-pink-300 hover:bg-pink-50"
                >
                  {item.slice(0, 1)}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-extrabold uppercase tracking-[0.16em] text-slate-700">Explorar</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="transition hover:text-pink-600">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-extrabold uppercase tracking-[0.16em] text-slate-700">Ayuda</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              {infoLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="transition hover:text-sky-600">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.16em] text-slate-700">Newsletter</p>
            <p className="mb-4 text-sm leading-6 text-slate-600">
              Recibe avisos de lanzamientos, promociones y nuevas colecciones.
            </p>

            <form className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="email-footer" className="sr-only">
                Correo electrónico
              </label>
              <input
                id="email-footer"
                type="email"
                placeholder="Tu correo"
                className="w-full rounded-full border border-pink-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none ring-0 transition placeholder:text-slate-400 focus:border-pink-300"
              />
              <button
                type="submit"
                className="rounded-full bg-gradient-to-r from-pink-500 to-pink-400 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-105"
              >
                Unirme
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-pink-100 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 MoonShelf. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <span>Privacidad</span>
            <span>Terminos</span>
            <span>Soporte</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
