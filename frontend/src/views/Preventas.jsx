import { useState } from 'react';
import Cart from '../components/Cart.jsx';
import '../styles/cart.css';
import nagatoroImage from '../assets/img/Nagatoro3.jpg';

const CartView = () => {
  // Estado local temporal (luego se remplaza con la api)
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Manga Vol. 1', description : 'sin descripcion por mientras w' , price: 67.99, quantity: 1, image: nagatoroImage },
    { id: 2, name: 'jeje 67', description : 'sin descripcion por mientras w' , price: 67.99, quantity: 1, image: nagatoroImage },
  ]);

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