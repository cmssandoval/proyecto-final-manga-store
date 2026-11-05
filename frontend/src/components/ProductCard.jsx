const ProductCard = ({ product, onAddToCart }) => {
  const hasImage = Boolean(product.image);
  const cardStyle = {
    background: product.colors
      ? `linear-gradient(135deg, ${product.colors[0]} 0%, ${product.colors[1] || product.colors[0]} 100%)`
      : '#f7dfe7',
  };

  const handleAddClick = () => {
    if (onAddToCart) {
      onAddToCart(product.title);
    }
  };

  return (
    <article className="card card-product">
      <div className="card-visual" style={cardStyle}>
        <div className="card-badges">
          <span className="availability-badge">Disponible</span>
          <span className="badge accent">{product.tag}</span>
        </div>

        <div className="cover-wrap">
          <div className="cover-box">
            {hasImage ? (
              <img src={product.image} alt={product.title} className="cover-image" />
            ) : (
              <span className="cover-letter">{product.short}</span>
            )}
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="card-copy-block">
          <span className="series-tag">{product.series}</span>
          <h3 className="card-title">{product.title}</h3>
        </div>

        <div className="card-price-block">
          <strong className="card-price">{product.price}</strong>
        </div>

        <button type="button" className="add-button" onClick={handleAddClick}>
          <span className="button-icon">🛒</span>
          Añadir al carrito
        </button>

        <button type="button" className="wishlist-button" aria-label="Añadir a wishlist">
          <span className="wish-icon">♡</span>
          Añadir a Wishlist
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
