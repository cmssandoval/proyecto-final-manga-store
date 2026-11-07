import '../styles/cart.css';

const Cart = ({ items = [], onRemoveItem, onUpdateQuantity }) => {
  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <p>Tu carrito está vacío.</p>
      </div>
    );
  }

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <div className="cart-items">
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name + " img"} className="cart-item-img" />
            <div  className="cart-item-details">
                <div>
              <h3>{item.name}</h3>
              <p>${item.price}</p>
            </div>
            <div className="cart-item-description">
              <p>{item.description}</p>
              </div>
            </div>
            <div className="cart-item-actions-container">
              <div className="cart-item-buttons">
              <button className='button primary' onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button className='button primary' onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => onRemoveItem(item.id)}>Eliminar</button>
            </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h2>Resumen del Pedido</h2>
        <p>Total: ${total.toFixed(2)}</p>
        <button className="button primary">Proceder al pago</button>
      </div>
    </div>
  );
};

export default Cart;