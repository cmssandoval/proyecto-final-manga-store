import { useContext } from 'react';
import OrdersContext from '../contexts/OrdersContext.jsx';

const useOrdersContext = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrdersContext debe ser usado dentro de un OrdersProvider');
  }
  return context;
};

export default useOrdersContext;
