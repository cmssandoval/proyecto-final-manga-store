import CartProvider from './CartProvider.jsx';
import DataProvider from './DataProvider.jsx';

const AppProviders = ({ children }) => {
  return (
    <DataProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </DataProvider>
  )
};

export default AppProviders;
