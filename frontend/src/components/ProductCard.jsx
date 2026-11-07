import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faHeart } from '@fortawesome/free-solid-svg-icons';

const ProductCard = ({ product, onAddToCart, onViewProduct }) => {
  const hasImage = Boolean(product.image);
  const cardStyle = {
    background: product.colors
      ? `linear-gradient(135deg, ${product.colors[0]} 0%, ${product.colors[1] || product.colors[0]} 100%)`
      : '#f7dfe7',
  };

  const handleCardClick = () => {
    if (onViewProduct && product?.id) {
      onViewProduct(product.id);
    }
  };

  const handleAddClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (onAddToCart) {
      onAddToCart(product.title);
    }
  };

  return (
    <article
      className="product-card"
      onClick={handleCardClick}
      onKeyDown={(event) => {
        if ((event.key === 'Enter' || event.key === ' ') && onViewProduct && product?.id) {
          event.preventDefault();
          onViewProduct(product.id);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalles de ${product.title}`}
    >
      <div className="product-card__visual" style={cardStyle}>
        <div className="product-card__badges">
          <span className="product-card__availability">Disponible</span>
          <span className="product-card__badge">{product.tag}</span>
        </div>

        <div className="product-card__cover-wrap">
          <div className="product-card__cover-box">
            {hasImage ? (
              <img src={product.image} alt={product.title} className="product-card__cover-image" />
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

        <button type="button" className="product-card__add-button" onClick={handleAddClick}>
          <FontAwesomeIcon icon={faCartShopping} className="product-card__button-icon" />
          Añadir al carrito
        </button>

        <button type="button" className="product-card__wishlist-button" aria-label="Añadir a wishlist">
          <FontAwesomeIcon icon={faHeart} className="product-card__wish-icon" />
          Añadir a Wishlist
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
