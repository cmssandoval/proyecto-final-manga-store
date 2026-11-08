import { useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faGift, faHeadset, faEnvelope, faArrowRight, faStar, faShieldHeart, faTruckFast } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import ProductCard from '../components/ProductCard.jsx';

import useDataContext from '../hooks/useDataContext.js';
import useCartContext from '../hooks/useCartContext.js';

const trustItems = [
  { icon: faTruckFast, label: 'Envío rápido' },
  { icon: faShieldHeart, label: 'Pago seguro' },
  { icon: faGift, label: 'Gift cards' },
  { icon: faHeadset, label: 'Atención real' },
];

const categoryItems = [
  { name: 'Shonen', count: '24 títulos' },
  { name: 'Romance', count: '18 títulos' },
  { name: 'Acción', count: '31 títulos' },
  { name: 'Deluxe', count: '12 ediciones' },
  { name: 'Dark fantasy', count: '9 títulos' },
  { name: 'Cómics', count: '15 títulos' },
];

const collectionItems = [
  { title: 'Starter Pack', description: 'Para empezar tu próxima obsesión.', accent: 'Pink' },
  { title: 'Top romance', description: 'Momentos tiernos y muy intensos.', accent: 'Sky' },
  { title: 'Acción extrema', description: 'Lucha, tensión y adrenalina pura.', accent: 'Lavender' },
];

const reviewItems = [
  { name: 'Ana R.', text: 'Llegó rápido y la edición es impecable. Me encantó la calidad de la portada.', rating: 5 },
  { name: 'Luis M.', text: 'Muy buena atención y los mangas están exactamente como anuncian.', rating: 5 },
  { name: 'Pau V.', text: 'La colección de romance es excelente. Mi favorito es Nagatoro-san.', rating: 4 },
];

const Home = () => {
  const navigate = useNavigate();
  const { homeData: featuredProducts } = useDataContext();
  const { addToCart } = useCartContext();

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

  const homeHighlights = useMemo(
    () => featuredProducts.slice(0, 4),
    [featuredProducts],
  );

  const handleAddToCart = (product) => {
    addToCart(product);
    window.alert(`${product.title} añadido al carrito`);
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
                <h1 id="home-hero-title" className="home-hero__title">Descubre tu próxima obsesión manga.</h1>
                <p className="home-hero__description">
                  Encuentra ediciones premium, clásicos irresistibles y lanzamientos exclusivos para cada fan del manga.
                </p>

                <div className="home-hero__actions">
                  <button type="button" className="home-hero__button home-hero__button--primary" onClick={() => navigate('/catalogo')}>
                    Ver catálogo
                  </button>
                  <button type="button" className="home-hero__button home-hero__button--secondary" onClick={() => navigate('/catalogo')}>
                    Colecciones
                  </button>
                </div>
              </div>

              <div className="home-hero__feature-panel">
                <div className="home-hero__feature-card">
                  <div className="home-hero__feature-header">
                    <span className="home-hero__pill">Best seller</span>
                    <span className="home-hero__price">$22.90</span>
                  </div>

                  <div className="home-hero__feature-cover">
                    <div className="home-hero__cover-box">
                      <span className="home-hero__cover-letter">M</span>
                    </div>
                  </div>

                  <div className="home-hero__stats">
                    <div className="home-hero__stat">
                      <span>Páginas</span>
                      <strong>220</strong>
                    </div>
                    <div className="home-hero__stat">
                      <span>Edición</span>
                      <strong>Deluxe</strong>
                    </div>
                    <div className="home-hero__stat">
                      <span>Rating</span>
                      <strong>4.9</strong>
                    </div>
                  </div>
                </div>
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
                <h2 id="home-categories-title" className="home-section__title">Categorías favoritas</h2>
              </div>
              <button type="button" className="home-section__link" onClick={() => navigate('/catalogo')}>
                Ver todo <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>

            <div className="home-categories__grid">
              {categoryItems.map((category) => (
                <button type="button" key={category.name} className="home-category" onClick={() => navigate('/catalogo')}>
                  <span className="home-category__name">{category.name}</span>
                  <span className="home-category__count">{category.count}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="home-featured" aria-labelledby="home-featured-title">
            <div className="home-section__header">
              <div>
                <p className="home-section__eyebrow">Top ventas</p>
                <h2 id="home-featured-title" className="home-section__title">Los más vendidos</h2>
              </div>
            </div>

            <div className="home-featured__grid">
              {homeHighlights.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </section>

          <section className="home-collections" aria-labelledby="home-collections-title">
            <div className="home-section__header">
              <div>
                <p className="home-section__eyebrow">Colecciones</p>
                <h2 id="home-collections-title" className="home-section__title">Recomendaciones del mes</h2>
              </div>
            </div>

            <div className="home-collections__grid">
              {collectionItems.map((collection) => (
                <article key={collection.title} className="home-collection">
                  <span className={`home-collection__accent home-collection__accent--${collection.accent.toLowerCase()}`}>
                    {collection.accent}
                  </span>
                  <h3 className="home-collection__title">{collection.title}</h3>
                  <p className="home-collection__description">{collection.description}</p>
                  <button type="button" className="home-collection__button" onClick={() => navigate('/catalogo')}>
                    Ver colección
                  </button>
                </article>
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
