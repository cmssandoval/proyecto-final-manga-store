import { useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowRight, faStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import ProductCard from '../components/ProductCard.jsx';

import useDataContext from '../hooks/useDataContext.js';
import useCartContext from '../hooks/useCartContext.js';
import formatClp from '../utils/formatClp.js';
import { trustItems, reviewItems } from '../data/homeViewItems.js';
import '../styles/home.css';

const HERO_MANGA_SEED = Math.random();

const Home = () => {
  const navigate = useNavigate();
  const { mangas, categories, demographicCategories } = useDataContext();
  const { addToCart } = useCartContext();
  const popularCategories = useMemo(() => [
    ...categories.map((category) => ({
      ...category,
      filterParam: 'category',
      filterLabel: 'Tema',
      count: mangas.filter((manga) => manga.categories?.includes(category.name)).length,
    })),
    ...demographicCategories.map((category) => ({
      ...category,
      filterParam: 'demographic',
      filterLabel: 'Demografía',
      count: mangas.filter((manga) => manga.demographic_categories?.includes(category.name)).length,
    })),
  ]
    .filter((category) => category.count > 0)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, 5), [categories, demographicCategories, mangas]);
  const featuredProducts = useMemo(() => mangas
    .map((manga) => ({
      manga,
      categoryOverlap: popularCategories.reduce((count, category) => {
        const mangaCategories = category.filterParam === 'category'
          ? manga.categories
          : manga.demographic_categories;
        return count + (mangaCategories?.includes(category.name) ? 1 : 0);
      }, 0),
    }))
    .sort((a, b) => (
      b.categoryOverlap - a.categoryOverlap
      || Number(b.manga.price) - Number(a.manga.price)
      || a.manga.name.localeCompare(b.manga.name)
    ))
    .slice(0, 5)
    .map(({ manga }) => manga), [mangas, popularCategories]);
  const heroManga = useMemo(() => (
    mangas.length ? mangas[Math.floor(HERO_MANGA_SEED * mangas.length)] : null
  ), [mangas]);
  useEffect(() => {
    document.title = 'MoonShelf | Tienda de manga premium';

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }

    metaDescription.setAttribute(
      'content',
      'MoonShelf ofrece manga premium, colecciones exclusivas y lanzamientos para fans de shonen, romance y acción.',
    );
  }, []);

  const handleAddToCart = async (product) => {
    try {
      if (!await addToCart(product)) {
        window.alert(`No hay más stock disponible de ${product.name}`);
        return;
      }

      window.alert(`${product.name || product.title} añadido al carrito`);
    } catch (error) {
      window.alert(error.message);
    }
  };

  return (
    <div className="home-page">
      <div className="home-shell">
        <main className="home-main">
          <section className="home-hero" aria-labelledby="home-hero-title">
            <div className="home-hero__glow home-hero__glow--right" />
            <div className="home-hero__glow home-hero__glow--left" />

            <div className="home-hero__grid">
              <div className="home-hero__copy">
                <p className="home-hero__eyebrow">Colección nueva</p>
                <h1 id="home-hero-title" className="home-hero__title">Más de 500 mangas disponibles!</h1>
                <p className="home-hero__description">
                  Encuentra ediciones premium, clásicos irresistibles y lanzamientos exclusivos importados directamente desde Japón y España!!!.
                </p>

                <div className="home-hero__actions">
                  <button type="button" className="home-hero__button home-hero__button--primary" onClick={() => navigate('/catalogo')}>
                    Ver catálogo
                  </button>
                </div>
              </div>

              <div className="home-hero__feature-panel">
                {heroManga && (
                  <div className="home-hero__feature-card" onClick={() => navigate(`/catalogo/${heroManga.slug}`)}>
                    <div className="home-hero__feature-header">
                      <span className="home-hero__pill">Del catálogo</span>
                      <span className="home-hero__price">{formatClp(heroManga.price)}</span>
                    </div>

                    <h2 className="home-hero__feature-title">{heroManga.name}</h2>

                    <div className="home-hero__feature-cover">
                      <div className="home-hero__cover-box">
                        {heroManga.image_link ? (
                          <img
                            src={heroManga.image_link}
                            alt={heroManga.name}
                            className="home-hero__cover-image"
                          />
                        ) : (
                          <span className="home-hero__cover-letter">{heroManga.name?.[0] || 'M'}</span>
                        )}
                      </div>
                    </div>

                    <div className="home-hero__stats">
                      <div className="home-hero__stat">
                        <span>Volumen</span>
                        <strong>{heroManga.volume || '—'}</strong>
                      </div>
                      <div className="home-hero__stat">
                        <span>Editorial</span>
                        <strong>{heroManga.editorial || '—'}</strong>
                      </div>
                      <div className="home-hero__stat">
                        <span>Stock</span>
                        <strong>{heroManga.stock ?? '—'}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="home-trust" aria-label="Beneficios de nuestra tienda">
            <div className="home-trust__list">
              {trustItems.map(({ icon, label }) => (
                <div key={label} className="home-trust__item">
                  <div className="home-trust__icon">
                    <FontAwesomeIcon icon={icon} />
                  </div>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="home-categories" aria-labelledby="home-categories-title">
            <div className="home-section__header">
              <div>
                <p className="home-section__eyebrow">Explora</p>
                <h2 id="home-categories-title" className="home-section__title">
                  Temas y demografías más populares
                </h2>
              </div>
              <button type="button" className="home-section__link" onClick={() => navigate('/catalogo')}>
                Ver todo <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>

            <div className="home-categories__grid">
              {popularCategories.map((category) => (
                <button
                  type="button"
                  key={`${category.filterParam}-${category.id}`}
                  className="home-category"
                  onClick={() => {
                    navigate(`/catalogo?${category.filterParam}=${encodeURIComponent(category.name)}`);
                  }}
                >
                  <span className="home-category__name">{category.name}</span>
                  <span className="home-category__count">
                    {category.count} títulos · {category.filterLabel}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="home-featured" aria-labelledby="home-featured-title">
            <div className="home-section__header">
              <div>
                <p className="home-section__eyebrow">Según sus categorías</p>
                <h2 id="home-featured-title" className="home-section__title">Mangas más populares</h2>
              </div>
            </div>

            <div className="home-featured__grid">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </section>

          <section className="home-reviews" aria-labelledby="home-reviews-title">
            <div className="home-section__header">
              <div>
                <p className="home-section__eyebrow">Reseñas</p>
                <h2 id="home-reviews-title" className="home-section__title">Lo que dicen nuestros lectores</h2>
              </div>
            </div>

            <div className="home-reviews__grid">
              {reviewItems.map((review) => (
                <article key={review.name} className="home-review">
                  <div className="home-review__rating" aria-label={`${review.rating} estrellas`}>
                    {Array.from({ length: review.rating }).map((_, index) => (
                      <FontAwesomeIcon key={`${review.name}-${index}`} icon={faStar} />
                    ))}
                  </div>
                  <p className="home-review__text">“{review.text}”</p>
                  <div className="home-review__author">{review.name}</div>
                </article>
              ))}
            </div>
          </section>

          <section className="home-newsletter" aria-labelledby="home-newsletter-title">
            <div className="home-newsletter__content">
              <div>
                <p className="home-section__eyebrow home-section__eyebrow--light">Newsletter</p>
                <h2 id="home-newsletter-title" className="home-section__title home-section__title--light">Recibe promociones y lanzamientos exclusivos</h2>
              </div>

              <form className="home-newsletter__form" onSubmit={(event) => event.preventDefault()}>
                <label htmlFor="newsletter-email" className="sr-only">Correo electrónico</label>
                <div className="home-newsletter__field">
                  <FontAwesomeIcon icon={faEnvelope} className="home-newsletter__icon" />
                  <input id="newsletter-email" type="email" placeholder="Tu correo electrónico" aria-label="Tu correo electrónico" />
                </div>
                <button type="submit" className="home-newsletter__button">Unirme</button>
              </form>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;
