import '../styles/cart.css';
import nagatoroImage from '../assets/img/Nagatoro3.jpg';

const CartView = () => {

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) return handleRemoveItem(id);
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  return (
    <main className="cart-page">
      <header className="cart-header">
        <h1>Mi Carrito de Compras</h1>
      </header>
      <section className="cart-content">
        <Cart
          items={cartItems}
          onRemoveItem={handleRemoveItem}
          onUpdateQuantity={handleUpdateQuantity}
        />
      </section>
    </main>
  );
};

export default CartView;