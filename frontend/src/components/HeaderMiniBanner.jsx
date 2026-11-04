import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';

const HeaderMiniBanner = () => {
  return (
    <header className="overflow-hidden rounded-t-[26px] border border-[#ecdfe8] bg-[#f6f0f4] shadow-[0_18px_45px_rgba(170,122,153,0.08)]">
      <div className="flex items-center justify-between gap-4 border-b border-[#eadce5] bg-[#f9f5f7] px-5 py-4 md:px-8">
        <div className="w-1/4">
          <BrandLogo />
        </div>

        <div className="flex flex-1 justify-center">
          <label className="flex w-full max-w-xl items-center gap-3 rounded-full border border-[#e7ced9] bg-white px-4 py-3 shadow-sm transition focus-within:border-[#8ccaf0] focus-within:ring-2 focus-within:ring-[#bfe5ff]">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-[#7f7284] stroke-[2]" aria-hidden="true">
              <circle cx="11" cy="11" r="6" />
              <path d="M16 16L21 21" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Buscar manga, autor o edición"
              className="w-full border-0 bg-transparent text-sm text-[#483d4d] placeholder:text-[#9a8c9b] outline-none"
            />
          </label>
        </div>

        <div className="flex w-1/4 items-center justify-end">
          <button className="flex items-center gap-2 rounded-full bg-[#ffffff] px-4 py-2 text-sm font-semibold text-[#3d2f3e] shadow-sm ring-1 ring-[#f0dfe7] transition hover:-translate-y-0.5 hover:shadow-md">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#f9c5d6] to-[#cfeeff] text-sm text-[#3d2f3e]">🛒</span>
            Carrito
            <span className="rounded-full bg-[#f7d6e9] px-2 py-0.5 text-xs text-[#573d4d]">2</span>
          </button>
        </div>
      </div>

      <nav className="grid grid-cols-3 gap-3 bg-[#f4eef2] px-4 py-3 text-center text-sm font-medium text-[#4d3c4e] md:grid-cols-5 md:gap-0 md:px-8">
        <Link to="/" className="rounded-full px-3 py-2 transition hover:bg-white/80">Inicio</Link>
        <Link to="/" className="rounded-full px-3 py-2 transition hover:bg-white/80">Catálogo</Link>
        <Link to="/perfil" className="rounded-full px-3 py-2 transition hover:bg-white/80">Mi cuenta</Link>
        <Link to="/" className="hidden rounded-full px-3 py-2 transition hover:bg-white/80 md:block">Colecciones</Link>
        <Link to="/" className="hidden rounded-full px-3 py-2 transition hover:bg-white/80 md:block">Contacto</Link>
      </nav>
    </header>
  );
};

export default HeaderMiniBanner;
