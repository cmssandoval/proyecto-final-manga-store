import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard.jsx';
import useCartContext from '../../hooks/useCartContext.js';
import useWishlistContext from '../../hooks/useWishlistContext.js';

const WishlistTab = () => {
  const { wishlistItems } = useWishlistContext();
  const { addToCart } = useCartContext();

  const handleAddToCart = (product) => {
    addToCart(product);
    window.alert(`${product.title} añadido al carrito`);
  };

  return (
    <div>
      <h2 className="profile-section-title">Mi Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <div className="profile-empty-state">
          <p>Guarda los mangas que quieras revisar más tarde.</p>
          <Link to="/catalogo">Explorar catálogo</Link>
        </div>
      ) : (
        <div className="wishlist-tab__grid">
          {wishlistItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistTab;
