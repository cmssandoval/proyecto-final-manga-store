import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import BrandLogo from './BrandLogo';
import useCartContext from '../hooks/useCartContext';

const HeaderMiniBanner = () => {
  const { cartCount } = useCartContext();

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
        <Link to="/" className="nav-link">Catálogo</Link>
        <Link to="/perfil" className="nav-link">Mi cuenta</Link>
        <Link to="/" className="nav-link desktop-only">Colecciones</Link>
        <Link to="/" className="nav-link desktop-only">Contacto</Link>
      </nav>
    </header>
  );
};

export default HeaderMiniBanner;
