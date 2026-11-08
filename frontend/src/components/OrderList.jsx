import { Link } from 'react-router-dom';

const dateFormatter = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const OrderList = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <h2>Aún no tienes órdenes</h2>
        <p>Cuando completes una compra, aquí verás la dirección de entrega y los mangas de tu pedido.</p>
        <Link to="/catalogo" className="orders-empty__link">Explorar catálogo</Link>
      </div>
    );
  }

  return (
    <div className="orders-list">
      {orders.map((order) => (
        <article className="order-card" key={order.id}>
          <header className="order-card__header">
            <div>
              <p className="order-card__eyebrow">Orden de compra</p>
              <h2 className="order-card__id">{order.id}</h2>
            </div>
            <span className="order-card__status">{order.status}</span>
          </header>

          <p className="order-card__date">
            Creada el {dateFormatter.format(new Date(order.createdAt))}
          </p>

          <section className="order-card__section" aria-label="Dirección de envío">
            <h3>Dirección de envío</h3>
            <p>{order.shippingAddress}</p>
          </section>

          <section className="order-card__section" aria-label="Mangas de la orden">
            <h3>Mangas incluidos</h3>
            <ul className="order-items">
              {order.items.map((item) => (
                <li className="order-item" key={item.id}>
                  {item.image && <img src={item.image} alt="" className="order-item__image" />}
                  <div className="order-item__details">
                    <span className="order-item__name">{item.name}</span>
                    <span className="order-item__quantity">Cantidad: {item.quantity}</span>
                  </div>
                  <strong className="order-item__price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </strong>
                </li>
              ))}
            </ul>
          </section>

          <footer className="order-card__total">
            <span>Total de la orden</span>
            <strong>${order.total.toFixed(2)}</strong>
          </footer>
        </article>
      ))}
    </div>
  );
};

export default OrderList;
