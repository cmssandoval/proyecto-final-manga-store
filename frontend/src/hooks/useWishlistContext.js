import { useContext } from 'react';
import WishlistContext from '../contexts/WishlistContext.jsx';

const useWishlistContext = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlistContext debe ser usado dentro de un WishlistProvider');
  }
  return context;
};

export default useWishlistContext;
