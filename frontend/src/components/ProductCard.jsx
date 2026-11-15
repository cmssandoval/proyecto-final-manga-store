import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faHeart } from '@fortawesome/free-solid-svg-icons';
import useUserContext from '../hooks/useUserContext.js';
import formatClp from '../utils/formatClp.js';

const ProductCard = ({ product, onAddToCart }) => {
  const location = useLocation();
  const { isWishlisted, isAddingToWishlist, addToWishlist } = useUserContext();
  const wishlisted = isWishlisted(product.id);
  const isAdding = isAddingToWishlist(product.id);
  const inStock = Number(product.stock) > 0;
  const cardStyle = {background: '#f7dfe7'};
  const demographicCategories = Array.isArray(product.demographic_categories)
    ? product.demographic_categories
    : [];
  const handleAddToWishlist = async () => {
    try {
      await addToWishlist(product);
    } catch (error) {
      window.alert(error.message);
    }
  };

  return (
    <article className="product-card">
      <Link
        className="product-card__details-link"
        to={`/catalogo/${product.slug}`}
        state={{ from: `${location.pathname}${location.search}` }}
      >
        <div className="product-card__visual" style={cardStyle}>
          <div className="product-card__badges">
            <span className="product-card__availability">{inStock ? 'Disponible' : 'Agotado'}</span>
            {demographicCategories[0] && (
              <span className="product-card__badge">{demographicCategories[0]}</span>
            )}
          </div>

          <div className="product-card__cover-wrap">
            <div className="product-card__cover-box">
              {product.image_link ? (
                <img src={product.image_link} alt="" className="product-card__cover-image" />
              ) : (
                <span className="product-card__cover-letter">{product.name}</span>
              )}
            </div>
          </div>
        </div>

        <div className="product-card__body">
          <div className="product-card__copy-block">
            {demographicCategories.map((demographic) => (
              <span key={demographic} className="product-card__series">{demographic}</span>
            ))}
            <h3 className="product-card__title">{product.name}</h3>
          </div>

          <div className="product-card__price-block">
            <strong className="product-card__price">{formatClp(product.price)}</strong>
          </div>
        </div>
      </Link>

      <div className="product-card__actions">
        {onAddToCart && (
          <button
            type="button"
            className="product-card__add-button"
            disabled={!inStock}
            onClick={() => onAddToCart(product)}
          >
            <FontAwesomeIcon icon={faCartShopping} className="product-card__button-icon" />
            {inStock ? 'Añadir al carrito' : 'Agotado'}
          </button>
        )}

        <button
          type="button"
          className="product-card__wishlist-button"
          aria-label={wishlisted ? `${product.name} está en wishlist` : `Añadir ${product.name} a wishlist`}
          aria-pressed={wishlisted}
          disabled={wishlisted || isAdding}
          onClick={handleAddToWishlist}
        >
          <FontAwesomeIcon icon={faHeart} className="product-card__wish-icon" />
          {wishlisted ? 'En Wishlist' : isAdding ? 'Agregando...' : 'Añadir a Wishlist'}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
