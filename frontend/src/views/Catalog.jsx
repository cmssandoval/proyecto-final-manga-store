import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faMagnifyingGlass, faSliders } from '@fortawesome/free-solid-svg-icons';

import ProductCard from '../components/ProductCard';

import blackCloverImage from '../assets/img/Bclover32.jpg';
import dorohedoroImage from '../assets/img/dorohedoro12.jpg';
import nagatoroImage from '../assets/img/Nagatoro3.jpg';
import kaseImage from '../assets/img/Kase4.jpg';
import nanaImage from '../assets/img/Nana1.jpg';
import jjkImage from '../assets/img/jjk.jpg';
import opmimg from '../assets/img/opm8.jpg';
import yn4img from '../assets/img/yn4.jpg';

const catalogItems = [
  {
    id: 1,
    title: 'Black Clover',
    series: 'Shonen',
    price: '$14.90',
    tag: 'Top',
    genre: 'shonen',
    volume: 'Vol. 12',
    short: 'BC',
    colors: ['#f9d7e4', '#cfeeff'],
    image: blackCloverImage,
  },
  {
    id: 2,
    title: 'Dorohedoro',
    series: 'Acción',
    price: '$12.50',
    tag: 'Nuevo',
    genre: 'accion',
    volume: 'Vol. 7',
    short: 'DH',
    colors: ['#f7dff8', '#d8f4ff'],
    image: dorohedoroImage,
  },
  {
    id: 3,
    title: 'Nagatoro-san',
    series: 'Comedia',
    price: '$16.20',
    tag: 'Popular',
    genre: 'romance',
    volume: 'Vol. 16',
    short: 'NS',
    colors: ['#f9d7d5', '#d9ebff'],
    image: nagatoroImage,
  },
  {
    id: 4,
    title: 'Kase-San & Yamada',
    series: 'Romance',
    price: '$15.00',
    tag: 'Gift',
    genre: 'romance',
    volume: 'Vol. 4',
    short: 'KY',
    colors: ['#f9dfe9', '#dceeff'],
    image: kaseImage,
  },
  {
    id: 5,
    title: 'Jujutsu Kaisen',
    series: 'Shonen',
    price: '$18.40',
    tag: 'Nuevo',
    genre: 'shonen',
    volume: 'Vol. 18',
    short: 'JK',
    colors: ['#f4d4ef', '#dfeaff'],
    image: jjkImage,
  },
  {
    id: 6,
    title: 'One Punch Man',
    series: 'Acción',
    price: '$17.80',
    tag: 'Top',
    genre: 'accion',
    volume: 'Vol. 8',
    short: 'OP',
    colors: ['#dfeaff', '#f9d7e4'],
    image: opmimg,
  },
  {
    id: 7,
    title: 'Chainsmoker Cat',
    series: 'Comedia',
    price: '$10.10',
    tag: 'Hot',
    genre: 'comedia',
    volume: 'Vol. 4',
    short: 'CC',
    colors: ['#e7f0ff', '#f9dfe9'],
    image: yn4img,
  },
  {
    id: 8,
    title: 'Nana',
    series: 'Drama',
    price: '$13.60',
    tag: 'Nuevo',
    genre: 'drama',
    volume: 'Vol. 1',
    short: 'NA',
    colors: ['#f5eadf', '#dff2ff'],
    image: nanaImage,
  },
];

const filterOptions = ['todos', 'shonen', 'romance', 'accion', 'fantasia', 'comedia', 'drama'];

const Catalog = () => {
  const navigate = useNavigate();
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
              onAddToCart={() => {}}
            />
          ))}
        </section>
      </div>
    </main>
  );
};

export default Catalog;
