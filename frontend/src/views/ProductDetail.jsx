import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCartShopping, faHeart } from '@fortawesome/free-solid-svg-icons';

import catalogItems from '../data/catalogItems';
import useCartContext from '../hooks/useCartContext.js';
import useWishlistContext from '../hooks/useWishlistContext.js';

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCartContext();
  const { isWishlisted, toggleWishlist } = useWishlistContext();

  const product = useMemo(
    () => catalogItems.find((item) => String(item.id) === String(id)),
    [id],
  );

  const handleGoBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
      return;
    }

    navigate(-1);
  };

  const handleAddToCart = () => {
    addToCart(product);
    window.alert(`${product.title} añadido al carrito`);
  };

  if (!product) {
    return (
      <main className="product-detail-page">
        <div className="product-detail-empty">
          <p className="product-detail-empty__eyebrow">Manga</p>
          <h1 className="product-detail-empty__title">Producto no encontrado</h1>
          <button
            type="button"
            onClick={handleGoBack}
            className="product-detail__back-button"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Volver
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="product-detail-page">
      <div className="product-detail-shell">
        <button
          type="button"
          onClick={handleGoBack}
          className="product-detail__back-button"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Volver
        </button>

        <article className="product-detail-card">
          <div className="product-detail-card__gallery">
            <img
              src={product.image}
              alt={product.title}
              className="product-detail-card__image"
            />
          </div>

          <div className="product-detail-card__content">
            <div className="product-detail-card__badge-row">
              <span className="product-detail-card__badge product-detail-card__badge--primary">
                {product.tag}
              </span>
              <span className="product-detail-card__badge product-detail-card__badge--secondary">
                {product.volume}
              </span>
            </div>

            <p className="product-detail-card__series">{product.series}</p>
            <h1 className="product-detail-card__title">{product.title}</h1>

            <div className="product-detail-card__meta-grid">
              <div className="product-detail-card__meta-item">
                <p className="product-detail-card__meta-label">Autor</p>
                <p className="product-detail-card__meta-value">{product.author || 'Sin autor'}</p>
              </div>
              <div className="product-detail-card__meta-item">
                <p className="product-detail-card__meta-label">Editorial</p>
                <p className="product-detail-card__meta-value">{product.publisher || 'Editorial'}</p>
              </div>
              <div className="product-detail-card__meta-item">
                <p className="product-detail-card__meta-label">Fecha</p>
                <p className="product-detail-card__meta-value">{product.releaseDate || '2026'}</p>
              </div>
              <div className="product-detail-card__meta-item">
                <p className="product-detail-card__meta-label">Categoría</p>
                <p className="product-detail-card__meta-value">{product.category || 'Manga'}</p>
              </div>
            </div>

            <p className="product-detail-card__description">{product.description}</p>

            <div className="product-detail-card__purchase-row">
              <div className="product-detail-card__price">{product.price}</div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="product-detail-card__cta product-detail-card__cta--primary"
              >
                <FontAwesomeIcon icon={faCartShopping} />
                Añadir al carrito
              </button>

              <button
                type="button"
                className="product-detail-card__cta product-detail-card__cta--secondary"
                aria-pressed={isWishlisted(product.id)}
                onClick={() => toggleWishlist(product.id)}
              >
                <FontAwesomeIcon icon={faHeart} />
                {isWishlisted(product.id) ? 'Quitar de Wishlist' : 'Añadir a Wishlist'}
              </button>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
};

export default ProductDetail;
