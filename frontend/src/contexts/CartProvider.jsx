import { useState } from 'react';
import CartContext from './CartContext.jsx';

const CartProvider = ({ children }) => {
  const [ cartCount, setCartCount ] = useState(0);

  return (
    <CartContext.Provider value={{
        cartCount,
        setCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;