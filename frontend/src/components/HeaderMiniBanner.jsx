import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';

const HeaderMiniBanner = () => {
  return (
    <header className="header-shell">
      <div className="header-top">
        <div className="header-brand">
          <BrandLogo />
        </div>

        <div className="header-search-wrap">
          <label className="header-search">
            <svg viewBox="0 0 24 24" className="search-icon" aria-hidden="true">
              <circle cx="11" cy="11" r="6" />
              <path d="M16 16L21 21" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Buscar manga, autor o edición"
              className="search-input"
            />
          </label>
        </div>

        <div className="header-cart-wrap">
          <button className="cart-button">
            <span className="cart-icon">🛒</span>
            Carrito
            <span className="cart-count">2</span>
          </button>
        </div>
      </div>

      <nav className="header-nav">
        <Link to="/" className="nav-link">Inicio</Link>
        <Link to="/" className="nav-link">Catálogo</Link>
        <Link to="/perfil" className="nav-link">Mi cuenta</Link>
        <Link to="/" className="nav-link desktop-only">Colecciones</Link>
        <Link to="/" className="nav-link desktop-only">Contacto</Link>
      </nav>
    </header>
  );
};

export default HeaderMiniBanner;
