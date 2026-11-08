import CartProvider from './CartProvider.jsx';
import DataProvider from './DataProvider.jsx';
import UserProvider from './UserProvider.jsx';
import WishlistProvider from './WishlistProvider.jsx';

const AppProviders = ({ children }) => {
  return (
    <DataProvider>
      <CartProvider>
        <UserProvider>
          <WishlistProvider>
            {children}
          </WishlistProvider>
        </UserProvider>
      </CartProvider>
    </DataProvider>
  )
};

export default AppProviders;
