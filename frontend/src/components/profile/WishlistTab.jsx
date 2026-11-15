import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard.jsx';
import useCartContext from '../../hooks/useCartContext.js';
import useUserContext from '../../hooks/useUserContext.js';

const WishlistTab = () => {
  const { wishlistItems, wishlistLoading, wishlistError } = useUserContext();
  const { addToCart } = useCartContext();

  const handleAddToCart = (product) => {
    if (!addToCart(product)) {
      window.alert(`No hay más stock disponible de ${product.name}`);
      return;
    }

    window.alert(`${product.name} añadido al carrito`);
  };

  return (
    <div>
      <h2 className="profile-section-title">Mi Wishlist</h2>
      {wishlistLoading ? (
        <p role="status">Cargando wishlist...</p>
      ) : wishlistError ? (
        <p role="alert">{wishlistError}</p>
      ) : wishlistItems.length === 0 ? (
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
