import CartProvider from './CartProvider.jsx';
import DataProvider from './DataProvider.jsx';
import UserProvider from './UserProvider.jsx';

const AppProviders = ({ children }) => {
  return (
    <DataProvider>
      <CartProvider>
        <UserProvider>
          {children}
        </UserProvider>
      </CartProvider>
    </DataProvider>
  )
};

export default AppProviders;
