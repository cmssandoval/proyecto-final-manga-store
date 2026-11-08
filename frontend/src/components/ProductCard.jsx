import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faHeart } from '@fortawesome/free-solid-svg-icons';
import useWishlistContext from '../hooks/useWishlistContext.js';

const ProductCard = ({ product, onAddToCart }) => {
  const location = useLocation();
  const { isWishlisted, toggleWishlist } = useWishlistContext();
  const wishlisted = isWishlisted(product.id);
  const cardStyle = {
    background: product.colors
      ? `linear-gradient(135deg, ${product.colors[0]} 0%, ${product.colors[1] || product.colors[0]} 100%)`
      : '#f7dfe7',
  };

  return (
    <article className="product-card">
      <Link
        className="product-card__details-link"
        to={`/catalogo/${product.id}`}
        state={{ from: `${location.pathname}${location.search}` }}
      >
        <div className="product-card__visual" style={cardStyle}>
          <div className="product-card__badges">
            <span className="product-card__availability">Disponible</span>
            <span className="product-card__badge">{product.tag}</span>
          </div>

          <div className="product-card__cover-wrap">
            <div className="product-card__cover-box">
              {product.image ? (
                <img src={product.image} alt="" className="product-card__cover-image" />
              ) : (
                <span className="product-card__cover-letter">{product.short}</span>
              )}
            </div>
          </div>
        </div>

        <div className="product-card__body">
          <div className="product-card__copy-block">
            <span className="product-card__series">{product.series}</span>
            <h3 className="product-card__title">{product.title}</h3>
          </div>

          <div className="product-card__price-block">
            <strong className="product-card__price">{product.price}</strong>
          </div>
        </div>
      </Link>

      <div className="product-card__actions">
        {onAddToCart && (
          <button
            type="button"
            className="product-card__add-button"
            onClick={() => onAddToCart(product)}
          >
            <FontAwesomeIcon icon={faCartShopping} className="product-card__button-icon" />
            Añadir al carrito
          </button>
        )}

        <button
          type="button"
          className="product-card__wishlist-button"
          aria-label={wishlisted ? `Quitar ${product.title} de wishlist` : `Añadir ${product.title} a wishlist`}
          aria-pressed={wishlisted}
          onClick={() => toggleWishlist(product.id)}
        >
          <FontAwesomeIcon icon={faHeart} className="product-card__wish-icon" />
          {wishlisted ? 'Quitar de Wishlist' : 'Añadir a Wishlist'}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
