import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import BrandLogo from './BrandLogo';
import useCartContext from '../hooks/useCartContext.js';
import useUserContext from '../hooks/useUserContext.js';

const HeaderMiniBanner = () => {
  const { cartCount } = useCartContext();
  const { user, logout } = useUserContext();

  return (
    <header className="header-shell">
      <div className="header-top">
        <div className="header-brand">
          <BrandLogo />
        </div>

        <div className="header-search-wrap">
          <label className="header-search">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar manga, autor o edición"
              className="search-input"
            />
          </label>
        </div>

        <div className="header-cart-wrap">
          <button className="cart-button" type="button">
            <FontAwesomeIcon icon={faCartShopping} className="cart-icon" />
            Carrito
            <span className="cart-count">{cartCount}</span>
          </button>
        </div>
      </div>

      <nav className="header-nav">
        <Link to="/" className="nav-link">Inicio</Link>
        <Link to="/catalogo" className="nav-link">Catálogo</Link>
        {user ? (
          <>
            <Link to="/perfil" className="nav-link">Mi Cuenta</Link>
            <button
              type="button"
              className="nav-link header-nav__logout"
              onClick={logout}
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <Link to="/login" className="nav-link">Iniciar Sesión</Link>
        )}
        <Link to="/catalogo" className="nav-link desktop-only">Colecciones</Link>
        <Link to="/" className="nav-link desktop-only">Contacto</Link>
      </nav>
    </header>
  );
};

export default HeaderMiniBanner;
