import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCartShopping, faHeart } from '@fortawesome/free-solid-svg-icons';

import catalogItems from '../data/catalogItems';
import useCartContext from '../hooks/useCartContext.js';

const ProductDetail = () => {
  const { id } = useParams();
  const { setCartCount } = useCartContext();

  const product = useMemo(
    () => catalogItems.find((item) => String(item.id) === String(id)),
    [id],
  );

  const handleAddToCart = () => {
    setCartCount((current) => current + 1);
    window.alert(`${product.title} añadido al carrito`);
  };

  if (!product) {
    return (
      <main className="min-h-screen bg-[#fff8fb] px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-pink-100 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-pink-500">Manga</p>
          <h1 className="mt-4 text-3xl font-black text-slate-800">Producto no encontrado</h1>
          <Link
            to="/catalogo"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-pink-500 px-5 py-3 text-sm font-bold text-white"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Volver al catálogo
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff8fb] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/catalogo"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-pink-300"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Volver al catálogo
        </Link>

        <article className="overflow-hidden rounded-[32px] border border-pink-100 bg-white shadow-sm">
          <div className="grid gap-8 p-5 md:grid-cols-2 md:p-8">
            <div className="rounded-[28px] border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-sky-50 p-4">
              <img
                src={product.image}
                alt={product.title}
                className="h-full min-h-[420px] w-full rounded-[20px] object-cover shadow-md"
              />
            </div>

            <div className="flex flex-col justify-center">
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-full bg-pink-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-pink-600">
                  {product.tag}
                </span>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-sky-700">
                  {product.volume}
                </span>
              </div>

              <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.22em] text-slate-500">{product.series}</p>
              <h1 className="text-4xl font-black tracking-[-0.07em] text-slate-800">{product.title}</h1>

              <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">Autor</p>
                  <p className="mt-2 font-semibold text-slate-800">{product.author || 'Sin autor'}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">Editorial</p>
                  <p className="mt-2 font-semibold text-slate-800">{product.publisher || 'Editorial'}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">Fecha</p>
                  <p className="mt-2 font-semibold text-slate-800">{product.releaseDate || '2026'}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">Categoría</p>
                  <p className="mt-2 font-semibold text-slate-800">{product.category || 'Manga'}</p>
                </div>
              </div>

              <p className="mt-6 text-base leading-7 text-slate-600">{product.description}</p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="text-3xl font-black tracking-[-0.06em] text-slate-800">{product.price}</div>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-pink-400 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-105"
                >
                  <FontAwesomeIcon icon={faCartShopping} />
                  Añadir al carrito
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-pink-300"
                >
                  <FontAwesomeIcon icon={faHeart} />
                  Wishlist
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
};

export default ProductDetail;
