import { Link, useNavigate } from 'react-router-dom';
import Cart from '../components/Cart.jsx';
import useCartContext from '../hooks/useCartContext.js';
import useOrdersContext from '../hooks/useOrdersContext.js';
import useUserContext from '../hooks/useUserContext.js';
import '../styles/cart.css';

const CartView = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartLoading,
    cartError,
  } = useCartContext();
  const { createOrder } = useOrdersContext();
  const { shippingAddress, token } = useUserContext();

  const handleCheckout = async (selectedAddress) => {
    await createOrder({ shippingAddress: selectedAddress, items: cartItems });
    await clearCart({ remoteAlreadyCleared: Boolean(token) });
    navigate('/ordenes');
  };

  return (
    <main className="cart-page" aria-labelledby="cart-title">
      <header className="cart-page__header">
        <p className="cart-page__eyebrow">Tu selección</p>
        <h1 className="cart-page__title" id="cart-title">Mi carrito</h1>
        <p className="cart-page__description">
          Revisa tus mangas y ajusta las cantidades antes de continuar.
        </p>
      </header>
      <section className="cart-page__content">
        <Cart
          items={cartItems}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onClearCart={clearCart}
          onCheckout={handleCheckout}
          shippingAddress={shippingAddress}
          isLoading={isCartLoading}
          error={cartError}
        />
        {cartItems.length > 0 && (
          <Link to="/catalogo" className="cart-page__continue-link">
            Seguir explorando el catálogo
          </Link>
        )}
      </section>
    </main>
  );
};

export default CartView;