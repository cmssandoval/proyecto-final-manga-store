const ProductCard = ({ product }) => {
  const hasImage = Boolean(product.image);

  const cardStyle = {
    background: `linear-gradient(135deg, ${product.colors[0]}, ${product.colors[1]})`,
  };

  return (
    <article className="card">
      <div className="card-visual" style={cardStyle}>
        <div className="card-badges">
          <span className="badge soft">Nuevo</span>
          <span className="badge accent">{product.tag}</span>
        </div>

        <div className="cover-wrap">
          <div className="cover-glow" />
          <div className={`cover-box ${hasImage ? 'with-image' : ''}`}>
            {hasImage ? (
              <img src={product.image} alt={product.title} className="cover-image" />
            ) : (
              <span className="cover-letter">{product.short}</span>
            )}
          </div>
        </div>
      </div>

      <div className="card-body">
        <p className="series">{product.series}</p>
        <h3 className="card-title">{product.title}</h3>
        <div className="card-meta">
          <span>{product.volume}</span>
          <strong>{product.price}</strong>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
