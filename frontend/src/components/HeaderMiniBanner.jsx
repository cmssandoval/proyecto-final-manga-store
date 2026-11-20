import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import BrandLogo from './BrandLogo';
import useCartContext from '../hooks/useCartContext.js';
import useDataContext from '../hooks/useDataContext.js';
import useUserContext from '../hooks/useUserContext.js';

const normalizeSearchText = (value) => String(value || '').toLowerCase();

const HeaderMiniBanner = () => {
  const { cartCount } = useCartContext();
  const { mangas } = useDataContext();
  const { user, logout } = useUserContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchDraft, setSearchDraft] = useState('');
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const search = location.pathname === '/catalogo'
    ? new URLSearchParams(location.search).get('q') ?? ''
    : searchDraft;

  const suggestions = useMemo(() => {
    const query = normalizeSearchText(search.trim());

    if (!query) {
      return [];
    }

    return mangas
      .filter((product) => [
        product.name,
        product.author,
        ...(product.categories || []),
        ...(product.demographic_categories || []),
      ].some((value) => normalizeSearchText(value).includes(query)))
      .slice(0, 5);
  }, [mangas, search]);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    const searchParams = location.pathname === '/catalogo'
      ? new URLSearchParams(location.search)
      : new URLSearchParams();

    if (query) {
      searchParams.set('q', query);
    } else {
      searchParams.delete('q');
    }

    const queryString = searchParams.toString();
    navigate(
      { pathname: '/catalogo', search: queryString ? `?${queryString}` : '' },
      { replace: location.pathname === '/catalogo' },
    );
    setSuggestionsOpen(false);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSuggestionsOpen(Boolean(query.trim()));

    if (location.pathname === '/catalogo') {
      const searchParams = new URLSearchParams(location.search);

      if (query.trim()) {
        searchParams.set('q', query);
      } else {
        searchParams.delete('q');
      }

      const queryString = searchParams.toString();
      navigate(
        { pathname: location.pathname, search: queryString ? `?${queryString}` : '' },
        { replace: true },
      );
    } else {
      setSearchDraft(query);
    }
  };

  return (
    <header className="header-shell">
      <div className="header-top">
        <div className="header-brand">
          <BrandLogo />
        </div>

        <div className="header-search-wrap">
          <form className="header-search" role="search" onSubmit={handleSearch}>
            <label htmlFor="header-search-input" className="sr-only">Buscar en el catálogo</label>
            <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" aria-hidden="true" />
            <input
              id="header-search-input"
              type="search"
              value={search}
              onChange={handleSearchChange}
              onFocus={() => setSuggestionsOpen(Boolean(search.trim()))}
              onBlur={(event) => {
                if (!event.currentTarget.closest('.header-search-wrap')?.contains(event.relatedTarget)) {
                  setSuggestionsOpen(false);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setSuggestionsOpen(false);
                }
              }}
              placeholder="Buscar manga, autor o edición"
              className="search-input"
            />
            <button type="submit" className="sr-only">Buscar</button>
          </form>
          {suggestionsOpen && search.trim() && (
            <ul id="header-search-suggestions" className="header-search-suggestions">
              {suggestions.length ? suggestions.map((product) => (
                <li key={product.id}>
                  <Link
                    className="header-search-suggestion"
                    to={`/catalogo/${product.slug}`}
                    state={{ from: `${location.pathname}${location.search}` }}
                    onClick={() => setSuggestionsOpen(false)}
                  >
                    <span className="header-search-suggestion__cover">
                      {product.image_link ? (
                        <img src={product.image_link} alt="" />
                      ) : (
                        <span>{product.name?.[0] || 'M'}</span>
                      )}
                    </span>
                    <span className="header-search-suggestion__details">
                      <strong>{product.name}</strong>
                      <span>{product.author}</span>
                      <span>{product.categories?.[0] || product.demographic_categories?.[0]}</span>
                    </span>
                  </Link>
                </li>
              )) : (
                <li className="header-search-suggestions__empty">No se encontraron mangas</li>
              )}
            </ul>
          )}
        </div>

        <div className="header-cart-wrap">
          <Link className="cart-button" to="/cart" aria-label={`Ver carrito, ${cartCount} productos`}>
            <FontAwesomeIcon icon={faCartShopping} className="cart-icon" />
            Carrito
            <span className="cart-count">{cartCount}</span>
          </Link>
        </div>
      </div>

      <nav className="header-nav">
        <Link to="/" className="nav-link">Inicio</Link>
        <Link to="/catalogo" className="nav-link">Catálogo</Link>
        <Link to="/ordenes" className="nav-link">
          {user ? 'Mis Órdenes' : 'Órdenes'}
        </Link>
        {user ? (
          <>
            <Link to="/perfil" className="nav-link">Mi Cuenta</Link>
            {Array.isArray(user.roles) && user.roles.includes('admin') && (
              <Link to="/admin/mangas" className="nav-link">Admin mangas</Link>
            )}
            <button
              type="button"
              className="nav-link header-nav__logout"
              onClick={logout}
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Iniciar Sesión</Link>
            <Link to="/register" className="nav-link">Registrarse</Link>
          </>
        )}
        
        { //? Colecciones personales del usuario? Corregir enlace y crear vista.
          /* <Link to="/catalogo" className="nav-link desktop-only">Colecciones</Link> */}
      </nav>
    </header>
  );
};

export default HeaderMiniBanner;
