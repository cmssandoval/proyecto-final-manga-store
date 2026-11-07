import { Link, useNavigate } from 'react-router-dom';
import Cart from '../components/Cart.jsx';
import useCartContext from '../hooks/useCartContext.js';
import useUserContext from '../hooks/useUserContext.js';
import '../styles/cart.css';

const CartView = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, createOrder } = useCartContext();
  const { shippingAddress } = useUserContext();

  const handleCheckout = (selectedAddress) => {
    createOrder(selectedAddress);
    navigate('/ordenes');
  };

  return (
    <main className="cart-page" aria-labelledby="cart-title">
      <header className="cart-header">
        <p className="cart-header__eyebrow">Tu selección</p>
        <h1 className="cart-header__title" id="cart-title">Mi carrito</h1>
        <p className="cart-header__description">
          Revisa tus mangas y ajusta las cantidades antes de continuar.
        </p>
      </header>
      <section className="cart-content">
        <Cart
          items={cartItems}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onCheckout={handleCheckout}
          shippingAddress={shippingAddress}
        />
        {cartItems.length > 0 && (
          <Link to="/catalogo" className="cart-continue-link">
            Seguir explorando el catálogo
          </Link>
        )}
      </section>
    </main>
  );
};

export default CartView;