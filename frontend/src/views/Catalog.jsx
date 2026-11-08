import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSliders } from '@fortawesome/free-solid-svg-icons';

import ProductCard from '../components/ProductCard';
import catalogItems from '../data/catalogItems';
import { getCatalogCategories } from '../data/catalogCategories.js';
import useCartContext from '../hooks/useCartContext.js';
import '../styles/catalog.css';

const categories = getCatalogCategories(catalogItems);
const filterOptions = [
  { id: 'todos', name: 'Todos' },
  ...categories,
];

const Catalog = () => {
  const { addToCart } = useCartContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q') || '';
  const requestedFilter = searchParams.get('genre') || 'todos';
  const selectedFilter = filterOptions.some(({ id }) => id === requestedFilter)
    ? requestedFilter
    : 'todos';
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

  const handleAddToCart = (product) => {
    addToCart(product);
    window.alert(`${product.title} añadido al carrito`);
  };

  const updateQueryParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);

    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }

    setSearchParams(nextParams, { replace: true });
  };

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const items = catalogItems.filter((item) => {
      const itemGenre = String(item.genre || '').toLowerCase();
      const matchesFilter = selectedFilter === 'todos' ? true : itemGenre === String(selectedFilter).toLowerCase();
      const matchesSearch =
        !normalizedSearch ||
        String(item.title || '').toLowerCase().includes(normalizedSearch) ||
        String(item.series || '').toLowerCase().includes(normalizedSearch) ||
        String(item.genre || '').toLowerCase().includes(normalizedSearch) ||
        String(item.author || '').toLowerCase().includes(normalizedSearch);

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
        <section className="catalog-filters" aria-label="Filtros del catálogo">
          <div className="catalog-filters__heading">
            <p className="catalog-filters__eyebrow">Colección</p>
            <h1 id="catalog-title" className="catalog-filters__title">Catálogo de mangas</h1>
          </div>

          <div className="catalog-filters__controls">
            <div className="catalog-filters__group">
              {filterOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => updateQueryParam('genre', option.id === 'todos' ? '' : option.id)}
                  className={[
                    'catalog-filter',
                    selectedFilter === option.id ? 'catalog-filter--active' : '',
                  ].join(' ')}
                >
                  {option.name}
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
              onAddToCart={handleAddToCart}
            />
          ))}
        </section>
      </div>
    </main>
  );
};

export default Catalog;
