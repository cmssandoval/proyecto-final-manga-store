import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faMagnifyingGlass, faSliders } from '@fortawesome/free-solid-svg-icons';

import ProductCard from '../components/ProductCard';
import catalogItems from '../data/catalogItems';
import useCartContext from '../hooks/useCartContext.js';

const filterOptions = ['todos', 'shonen', 'romance', 'accion', 'fantasia', 'comedia', 'drama'];

const Catalog = () => {
  const navigate = useNavigate();
  const { addToCart } = useCartContext();
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('relevancia');

  useEffect(() => {
    document.title = 'Catálogo de manga | MoonShelf';

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }

    metaDescription.setAttribute(
      'content',
      'Explora el catálogo de manga de MoonShelf con shonen, romance, acción, comedia y colecciones premium.',
    );
  }, []);

  const handleViewProduct = (productId) => {
    navigate(`/catalogo/${productId}`, { state: { from: '/catalogo' } });
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    window.alert(`${product.title} añadido al carrito`);
  };

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const items = catalogItems.filter((item) => {
      const itemGenre = String(item.genre || '').toLowerCase();
      const matchesFilter = selectedFilter === 'todos' ? true : itemGenre === String(selectedFilter).toLowerCase();
      const matchesSearch =
        !normalizedSearch ||
        String(item.title || '').toLowerCase().includes(normalizedSearch) ||
        String(item.series || '').toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });

    if (sortBy === 'precio-asc') {
      return [...items].sort((a, b) => Number(a.price.replace(/[^\d.]/g, '')) - Number(b.price.replace(/[^\d.]/g, '')));
    }

    if (sortBy === 'precio-desc') {
      return [...items].sort((a, b) => Number(b.price.replace(/[^\d.]/g, '')) - Number(a.price.replace(/[^\d.]/g, '')));
    }

    if (sortBy === 'titulo') {
      return [...items].sort((a, b) => a.title.localeCompare(b.title));
    }

    return items;
  }, [search, selectedFilter, sortBy]);

  return (
    <main className="catalog-page" aria-labelledby="catalog-title">
      <div className="catalog-shell">
        <section className="catalog-hero">
          <div className="catalog-hero__content">
            <p className="catalog-hero__eyebrow">Colección</p>
            <h1 id="catalog-title" className="catalog-hero__title">Catálogo de mangas</h1>
          </div>

          <div className="catalog-search">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="catalog-search__icon" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por título o género"
              className="catalog-search__input"
              aria-label="Buscar manga"
            />
          </div>
        </section>

        <section className="catalog-filters" aria-label="Filtros del catálogo">
          <div className="catalog-filters__group">
            {filterOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedFilter(option)}
                className={[
                  'catalog-filter',
                  selectedFilter === option ? 'catalog-filter--active' : '',
                ].join(' ')}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="catalog-sort">
            <FontAwesomeIcon icon={faSliders} className="catalog-sort__icon" />
            <label htmlFor="catalog-sort" className="sr-only">Ordenar</label>
            <select
              id="catalog-sort"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="catalog-sort__select"
            >
              <option value="relevancia">Relevancia</option>
              <option value="titulo">Título</option>
              <option value="precio-asc">Precio: menor</option>
              <option value="precio-desc">Precio: mayor</option>
            </select>
          </div>
        </section>

        <section className="catalog-results" aria-live="polite">
          <div className="catalog-results__summary">
            <FontAwesomeIcon icon={faFilter} className="catalog-results__icon" />
            <span>{filteredItems.length} resultados</span>
          </div>
        </section>

        <section className="catalog-grid">
          {filteredItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewProduct={handleViewProduct}
              onAddToCart={handleAddToCart}
            />
          ))}
        </section>
      </div>
    </main>
  );
};

export default Catalog;
