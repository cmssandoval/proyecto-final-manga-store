import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import WishlistContext from './WishlistContext.jsx';
import useUserContext from '../hooks/useUserContext.js';
import catalogItems from '../data/catalogItems.js';

//* Limpiar mock al implementar el backend.
import mockWishlistProductIds from '../data/wishlistItems.js';

// import axiosClient from '../api/axiosClient.js';

const WishlistProvider = ({ children }) => {
  const { user } = useUserContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [wishlistProductIds, setWishlistProductIds] = useState([]);

  useEffect(() => {
    let isCurrent = true;

    const loadWishlist = async () => {
      if (!user) {
        setWishlistProductIds([]);
        return;
      }

      // * Llamada a la API, descomentar una vez evaluado el frontend.
      // const response = await axiosClient.get('/users/me/wishlist');
      // if (isCurrent) setWishlistProductIds(response.data.items.map((item) => item.productId));
      if (isCurrent) setWishlistProductIds([...mockWishlistProductIds]);
    };

    loadWishlist();

    return () => {
      isCurrent = false;
    };
  }, [user]);

  const toggleWishlist = async (productId) => {
    if (!user) {
      navigate('/login', { state: { from: location }, replace: true });
      return;
    }

    if (wishlistProductIds.includes(productId)) {
      // * Llamada a la API, descomentar una vez evaluado el frontend.
      // await axiosClient.delete(`/users/me/wishlist/${productId}`);
      setWishlistProductIds((currentIds) => currentIds.filter((id) => id !== productId));
      return;
    }

    // * Llamada a la API, descomentar una vez evaluado el frontend.
    // await axiosClient.post('/users/me/wishlist', { productId });
    setWishlistProductIds((currentIds) => (
      currentIds.includes(productId) ? currentIds : [...currentIds, productId]
    ));
  };

  const wishlistItems = wishlistProductIds
    .map((productId) => catalogItems.find((product) => product.id === productId))
    .filter(Boolean);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistProductIds,
        isWishlisted: (productId) => wishlistProductIds.includes(productId),
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
