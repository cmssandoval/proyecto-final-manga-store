import { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faMagnifyingGlass, faSliders } from '@fortawesome/free-solid-svg-icons';

import ProductCard from '../components/ProductCard';

import blackCloverImage from '../assets/img/Bclover32.jpg';
import dorohedoroImage from '../assets/img/dorohedoro12.jpg';
import nagatoroImage from '../assets/img/Nagatoro3.jpg';
import kaseImage from '../assets/img/Kase4.jpg';

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
    image: blackCloverImage,
  },
  {
    id: 6,
    title: 'One Punch Man',
    series: 'Acción',
    price: '$17.80',
    tag: 'Top',
    genre: 'accion',
    volume: 'Vol. 9',
    short: 'OP',
    colors: ['#dfeaff', '#f9d7e4'],
    image: dorohedoroImage,
  },
  {
    id: 7,
    title: 'My Hero Academia',
    series: 'Heroico',
    price: '$19.10',
    tag: 'Hot',
    genre: 'fantasia',
    volume: 'Vol. 28',
    short: 'MH',
    colors: ['#e7f0ff', '#f9dfe9'],
    image: nagatoroImage,
  },
  {
    id: 8,
    title: 'Spy x Family',
    series: 'Comedia',
    price: '$13.60',
    tag: 'Nuevo',
    genre: 'comedia',
    volume: 'Vol. 11',
    short: 'SX',
    colors: ['#f5eadf', '#dff2ff'],
    image: kaseImage,
  },
];

const filterOptions = ['todos', 'shonen', 'romance', 'accion', 'fantasia', 'comedia'];

const Catalog = () => {
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('relevancia');

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const items = catalogItems.filter((item) => {
      const matchesFilter = selectedFilter === 'todos' ? true : item.genre === selectedFilter;
      const matchesSearch =
        !normalizedSearch ||
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.series.toLowerCase().includes(normalizedSearch);

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
    <main className="min-h-screen bg-[#fff8fb] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-6 rounded-[28px] border border-pink-100 bg-gradient-to-r from-pink-50 via-white to-sky-50 p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-pink-500">Colección</p>
              <h1 className="text-3xl font-black tracking-[-0.06em] text-slate-800 sm:text-4xl">Catálogo de mangas</h1>
            </div>

            <div className="flex w-full max-w-xl items-center gap-3 rounded-full border border-pink-200 bg-white px-4 py-3 shadow-sm">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-sm text-slate-500" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por título o género"
                className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                aria-label="Buscar manga"
              />
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-[24px] border border-pink-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSelectedFilter(option)}
                  className={[
                    'rounded-full border px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] transition',
                    selectedFilter === option
                      ? 'border-pink-300 bg-pink-500 text-white shadow-sm'
                      : 'border-pink-100 bg-pink-50 text-slate-600 hover:border-pink-200',
                  ].join(' ')}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
              <FontAwesomeIcon icon={faSliders} className="text-sm text-slate-500" />
              <label htmlFor="sort" className="sr-only">Ordenar</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="border-0 bg-transparent text-sm font-medium text-slate-700 outline-none"
              >
                <option value="relevancia">Relevancia</option>
                <option value="titulo">Título</option>
                <option value="precio-asc">Precio: menor</option>
                <option value="precio-desc">Precio: mayor</option>
              </select>
            </div>
          </div>
        </section>

        <section className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <FontAwesomeIcon icon={faFilter} className="text-pink-500" />
            <span>{filteredItems.length} resultados</span>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {filteredItems.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={() => {}} />
          ))}
        </section>
      </div>
    </main>
  );
};

export default Catalog;
