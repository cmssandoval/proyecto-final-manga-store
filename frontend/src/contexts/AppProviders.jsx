import CartProvider from './CartProvider.jsx';
import DataProvider from './DataProvider.jsx';
import OrdersProvider from './OrdersProvider.jsx';
import UserProvider from './UserProvider.jsx';

const AppProviders = ({ children }) => {
  return (
    <DataProvider>
      <UserProvider>
        <OrdersProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </OrdersProvider>
      </UserProvider>
    </DataProvider>
  )
};

export default AppProviders;
