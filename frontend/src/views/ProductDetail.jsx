import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCartShopping, faHeart } from '@fortawesome/free-solid-svg-icons';

import useCartContext from '../hooks/useCartContext.js';
import useDataContext from '../hooks/useDataContext.js';
import useUserContext from '../hooks/useUserContext.js';
import formatClp from '../utils/formatClp.js';
import '../styles/product-detail.css';

const ProductDetail = () => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { mangas, isMangasLoading } = useDataContext();
  const { addToCart } = useCartContext();
  const {
    isWishlisted,
    isUpdatingWishlist,
    addToWishlist,
    removeFromWishlist,
  } = useUserContext();

  const product = mangas.find((manga) => manga.slug === slug);

  const handleGoBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
      return;
    }

    navigate(-1);
  };

  const handleAddToCart = () => {
    if (!addToCart(product)) {
      window.alert(`No hay más stock disponible de ${product.name}`);
      return;
    }

    window.alert(`${product.name} añadido al carrito`);
  };

  const handleToggleWishlist = async () => {
    try {
      if (isWishlisted(product.id)) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product);
      }
    } catch (error) {
      window.alert(error.message);
    }
  };

  if (isMangasLoading) {
    return (
      <main className="product-detail-page">
        <div className="product-detail-empty">
          <p className="product-detail-empty__eyebrow">Manga</p>
          <h1 className="product-detail-empty__title">Cargando catálogo...</h1>
        </div>
      </main>
    );
  }

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
              src={product.image_link}
              alt={product.name}
              className="product-detail-card__image"
            />
          </div>

          <div className="product-detail-card__content">
            <div className="product-detail-card__badge-row">
              <span className="product-detail-card__badge product-detail-card__badge--primary">
                {product.stock > 0 ? 'Disponible' : 'Agotado'}
              </span>
              <span className="product-detail-card__badge product-detail-card__badge--secondary">
                {product.volume || 'Volumen sin especificar'}
              </span>
            </div>

            <p className="product-detail-card__series">
              {product.demographic_categories?.join(' · ') || 'Manga'}
            </p>
            <h1 className="product-detail-card__title">{product.name}</h1>

            <div className="product-detail-card__meta-grid">
              <div className="product-detail-card__meta-item">
                <p className="product-detail-card__meta-label">Autor</p>
                <p className="product-detail-card__meta-value">{product.author || 'Sin autor'}</p>
              </div>
              <div className="product-detail-card__meta-item">
                <p className="product-detail-card__meta-label">Editorial</p>
                <p className="product-detail-card__meta-value">{product.editorial || 'Sin editorial'}</p>
              </div>
              <div className="product-detail-card__meta-item">
                <p className="product-detail-card__meta-label">Categorías</p>
                <p className="product-detail-card__meta-value">{product.categories?.join(', ') || 'Manga'}</p>
              </div>
            </div>

            <p className="product-detail-card__description">{product.description}</p>

            <div className="product-detail-card__purchase-row">
              <div className="product-detail-card__price">{formatClp(product.price)}</div>

              <button
                type="button"
                disabled={product.stock <= 0}
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
                aria-label={isWishlisted(product.id)
                  ? `Quitar ${product.name} de wishlist`
                  : `Añadir ${product.name} a wishlist`}
                disabled={isUpdatingWishlist(product.id)}
                onClick={handleToggleWishlist}
              >
                <FontAwesomeIcon icon={faHeart} />
                {isWishlisted(product.id)
                  ? isUpdatingWishlist(product.id) ? 'Quitando...' : 'Quitar de Wishlist'
                  : isUpdatingWishlist(product.id) ? 'Agregando...' : 'Añadir a Wishlist'}
              </button>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
};

export default ProductDetail;
