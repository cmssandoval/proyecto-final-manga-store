import OrderList from '../components/OrderList.jsx';
import useOrdersContext from '../hooks/useOrdersContext.js';
import '../styles/orders.css';

const PurchaseOrders = () => {
  const {
    orders,
    isOrdersLoading,
    ordersError,
    hasPendingGuestOrders,
    retryGuestOrderSync,
  } = useOrdersContext();

  return (
    <main className="orders-page" aria-labelledby="orders-title">
      <header className="orders-page__header">
        <p className="orders-page__eyebrow">Historial de compra</p>
        <h1 className="orders-page__title" id="orders-title">Órdenes de compra</h1>
        <p className="orders-page__description">
          Consulta los mangas de cada compra y la dirección a la que serán enviados.
        </p>
      </header>
      {isOrdersLoading && <p role="status">Cargando órdenes...</p>}
      {ordersError && <p role="alert">{ordersError}</p>}
      {hasPendingGuestOrders && (
        <button
          type="button"
          className="orders-sync-retry"
          onClick={retryGuestOrderSync}
          disabled={isOrdersLoading}
        >
          Reintentar sincronización
        </button>
      )}
      {!isOrdersLoading && (!ordersError || orders.length > 0) && (
        <OrderList orders={orders} />
      )}
    </main>
  );
};

export default PurchaseOrders;
