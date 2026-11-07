import OrderList from '../OrderList.jsx';
import useCartContext from '../../hooks/useCartContext.js';
import '../../styles/orders.css';

const OrdersTab = () => {
  const { orders } = useCartContext();

  return (
    <div>
      <h2 className="profile-section-title">Mis órdenes</h2>
      <OrderList orders={orders} />
    </div>
  );
};

export default OrdersTab;
