import OrderList from '../components/OrderList.jsx';
import useCartContext from '../hooks/useCartContext.js';
import '../styles/orders.css';

const PurchaseOrders = () => {
  const { orders } = useCartContext();

  return (
    <main className="orders-page" aria-labelledby="orders-title">
      <header className="orders-page__header">
        <p className="orders-page__eyebrow">Tu cuenta</p>
        <h1 className="orders-page__title" id="orders-title">Órdenes de compra</h1>
        <p className="orders-page__description">
          Consulta los mangas de cada compra y la dirección a la que serán enviados.
        </p>
      </header>
      <OrderList orders={orders} />
    </main>
  );
};

export default PurchaseOrders;
