import CartProvider from "./CartProvider";
import DataProvider from "./DataProvider";

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
