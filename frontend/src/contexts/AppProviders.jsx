import CartProvider from './CartProvider.jsx';
import DataProvider from './DataProvider.jsx';
import UserProvider from './UserProvider.jsx';

const AppProviders = ({ children }) => {
  return (
    <DataProvider>
      <UserProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </UserProvider>
    </DataProvider>
  )
};

export default AppProviders;
