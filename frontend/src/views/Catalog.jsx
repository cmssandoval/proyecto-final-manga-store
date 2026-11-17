import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSliders } from '@fortawesome/free-solid-svg-icons';

import ProductCard from '../components/ProductCard';
import useCartContext from '../hooks/useCartContext.js';
import useDataContext from '../hooks/useDataContext.js';
import '../styles/catalog.css';

const Catalog = () => {
  const { mangas, categories, demographicCategories } = useDataContext();
  const { addToCart } = useCartContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || '';
  const selectedDemographic = searchParams.get('demographic') || '';
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

  const handleAddToCart = async (product) => {
    try {
      if (!await addToCart(product)) {
        window.alert(`No hay más stock disponible de ${product.name}`);
        return;
      }

      window.alert(`${product.name} añadido al carrito`);
    } catch (error) {
      window.alert(error.message);
    }
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

    const items = mangas.filter((item) => {
      const itemCategories = Array.isArray(item.categories) ? item.categories : [];
      const itemDemographics = Array.isArray(item.demographic_categories)
        ? item.demographic_categories
        : [];
      const matchesCategory =
        !selectedCategory ||
        itemCategories.some((category) => category.toLowerCase() === selectedCategory.toLowerCase());
      const matchesDemographic =
        !selectedDemographic ||
        itemDemographics.some(
          (demographic) => demographic.toLowerCase() === selectedDemographic.toLowerCase(),
        );
      const matchesSearch =
        !normalizedSearch ||
        [
          item.name,
          item.author,
          ...itemCategories,
          ...itemDemographics,
        ].some((value) => String(value || '').toLowerCase().includes(normalizedSearch));

      return matchesCategory && matchesDemographic && matchesSearch;
    });

    if (sortBy === 'precio-asc') {
      return [...items].sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sortBy === 'precio-desc') {
      return [...items].sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (sortBy === 'titulo') {
      return [...items].sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
    }

    return items;
  }, [mangas, search, selectedCategory, selectedDemographic, sortBy]);

  const categoryFilterOptions = [
    { id: 'all-categories', name: 'Todas' },
    ...categories,
  ];
  const demographicFilterOptions = [
    { id: 'all-demographics', name: 'Todas' },
    ...demographicCategories,
  ];

  return (
    <main className="catalog-page" aria-labelledby="catalog-title">
      <div className="catalog-shell">
        <section className="catalog-filters" aria-label="Filtros del catálogo">
          <div className="catalog-filters__heading">
            <h1 id="catalog-title" className="catalog-filters__title">Catálogo de mangas</h1>
          </div>

          <div className="catalog-filters__controls">
            <div className="catalog-filters__group" role="group" aria-label="Filtrar por categoría">
              <span className="catalog-filters__group-label">Categorías</span>
              {categoryFilterOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => updateQueryParam('category', option.id === 'all-categories' ? '' : option.name)}
                  className={[
                    'catalog-filter',
                    (selectedCategory === '' && option.id === 'all-categories') ||
                    selectedCategory.toLowerCase() === option.name.toLowerCase()
                      ? 'catalog-filter--active'
                      : '',
                  ].join(' ')}
                >
                  {option.name}
                </button>
              ))}
            </div>

            <div className="catalog-filters__group" role="group" aria-label="Filtrar por demografía">
              <span className="catalog-filters__group-label">Demografía</span>
              {demographicFilterOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => updateQueryParam('demographic', option.id === 'all-demographics' ? '' : option.name)}
                  className={[
                    'catalog-filter',
                    (selectedDemographic === '' && option.id === 'all-demographics') ||
                    selectedDemographic.toLowerCase() === option.name.toLowerCase()
                      ? 'catalog-filter--active'
                      : '',
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
