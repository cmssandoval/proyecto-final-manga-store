import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from './UserContext.jsx';
import axiosClient from '../api/axiosClient.js';

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(
    () => localStorage.getItem('shippingAddress')
  );
  const [token, setToken] = useState(
    () => localStorage.getItem('token')
  );
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistError, setWishlistError] = useState(null);
  const [pendingWishlistIds, setPendingWishlistIds] = useState([]);
  const pendingWishlistIdsRef = useRef(new Set());
  const wishlistSessionVersionRef = useRef(0);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    wishlistSessionVersionRef.current += 1;
    pendingWishlistIdsRef.current.clear();
  }, [token]);

  const clearSession = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const fetchUser = async () => {
    const { data } = await axiosClient.get('/users/me');    
    return data?.user ?? null;
  };

  useEffect(() => {
    let isCurrent = true;
    const sessionVersion = wishlistSessionVersionRef.current;

    const loadWishlist = async () => {
      if (!user) {
        setWishlistItems([]);
        setWishlistError(null);
        setWishlistLoading(false);
        return;
      }

      setWishlistItems([]);
      setWishlistLoading(true);
      setWishlistError(null);

      try {
        const response = await axiosClient.get('/users/me/wishlist');
        const wishlist = response.data?.wishlist;

        if (!Array.isArray(wishlist)) {
          throw new Error('La respuesta de wishlist no tiene un formato válido.');
        }

        if (isCurrent && sessionVersion === wishlistSessionVersionRef.current) {
          setWishlistItems(wishlist);
        }
      } catch (loadError) {
        if (isCurrent && sessionVersion === wishlistSessionVersionRef.current) {
          setWishlistError(loadError.response?.data?.message || loadError.message);
        }
      } finally {
        if (isCurrent && sessionVersion === wishlistSessionVersionRef.current) {
          setWishlistLoading(false);
        }
      }
    };

    loadWishlist();

    return () => {
      isCurrent = false;
    };
  }, [user, token]);

  const wishlistProductIds = wishlistItems.map((product) => product.id);
  const addToWishlist = async (product) => {
    if (!user) {
      throw new Error('Inicia sesión para agregar mangas a tu wishlist.');
    }

    if (!product?.id) {
      throw new Error('No se puede agregar un manga sin identificador a la wishlist.');
    }

    const sessionVersion = wishlistSessionVersionRef.current;
    const pendingKey = JSON.stringify([sessionVersion, product.id]);

    if (
      wishlistProductIds.includes(product.id)
      || pendingWishlistIdsRef.current.has(pendingKey)
    ) {
      return false;
    }

    pendingWishlistIdsRef.current.add(pendingKey);
    setPendingWishlistIds((currentItems) => [
      ...currentItems,
      { id: product.id, sessionVersion, pendingKey },
    ]);

    try {
      await axiosClient.post('/users/me/wishlist', { mangaId: product.id });
      if (sessionVersion !== wishlistSessionVersionRef.current) {
        return false;
      }

      setWishlistItems((currentItems) => (
        currentItems.some((item) => item.id === product.id)
          ? currentItems
          : [...currentItems, product]
      ));
      setWishlistError(null);
      return true;
    } catch (addError) {
      if (sessionVersion !== wishlistSessionVersionRef.current) {
        return false;
      }

      setWishlistError(addError.response?.data?.message || addError.message);
      throw addError;
    } finally {
      pendingWishlistIdsRef.current.delete(pendingKey);
      setPendingWishlistIds((currentItems) => (
        currentItems.filter((item) => item.pendingKey !== pendingKey)
      ));
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) {
      throw new Error('Inicia sesión para quitar mangas de tu wishlist.');
    }

    if (!productId) {
      throw new Error('No se puede quitar un manga sin identificador de la wishlist.');
    }

    const sessionVersion = wishlistSessionVersionRef.current;
    const pendingKey = JSON.stringify([sessionVersion, productId]);

    if (
      !wishlistProductIds.includes(productId)
      || pendingWishlistIdsRef.current.has(pendingKey)
    ) {
      return false;
    }

    pendingWishlistIdsRef.current.add(pendingKey);
    setPendingWishlistIds((currentItems) => [
      ...currentItems,
      { id: productId, sessionVersion, pendingKey },
    ]);

    try {
      await axiosClient.delete(`/users/me/wishlist/${encodeURIComponent(productId)}`);
      if (sessionVersion !== wishlistSessionVersionRef.current) {
        return false;
      }

      setWishlistItems((currentItems) => (
        currentItems.filter((item) => item.id !== productId)
      ));
      setWishlistError(null);
      return true;
    } catch (removeError) {
      if (sessionVersion !== wishlistSessionVersionRef.current) {
        return false;
      }

      setWishlistError(removeError.response?.data?.message || removeError.message);
      throw removeError;
    } finally {
      pendingWishlistIdsRef.current.delete(pendingKey);
      setPendingWishlistIds((currentItems) => (
        currentItems.filter((item) => item.pendingKey !== pendingKey)
      ));
    }
  };

  useEffect(() => {
    const id = axiosClient.interceptors.response.use(
      (response) => response,
      (error) => {
        const sentToken = Boolean(error.config?.headers?.Authorization);
        if (error.response?.status === 401 && sentToken) clearSession();
        return Promise.reject(error);
      },
    );
    return () => {
      axiosClient.interceptors.response.eject(id);
    }
  }, [clearSession]);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const storedToken = localStorage.getItem('token');

        if (storedToken) {
          const fetchedUser = await fetchUser();
          setUser(fetchedUser);
        }
      } catch {
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    initializeSession();
  }, [clearSession]);

  const login = async (credentials) => {
    const { data } = await axiosClient.post('/users/login', credentials);
    localStorage.setItem('token', data.token);
    setToken(data.token)
  
    try {
      const fetchedUser = await fetchUser();
      setUser(fetchedUser);
      return fetchedUser;
    } catch (error) {
      clearSession();
      throw error;
    }
  };

  const register = async ({ name, email, password }) => {
    try {
      await axiosClient.post('/users/register', {
        email,
        full_name: name,
        display_name: name.trim(),
        password,
      });
      return '¡Usuario creado correctamente!';
    } catch {
      throw new Error('Error del servidor. Inténtelo de nuevo más tarde.');
    }
  };

  const logout = () => {
    clearSession();
    navigate('/');
  };

  const updateShippingAddress = (address) => {
    const normalizedAddress = address.trim();

    if (!normalizedAddress) {
      throw new Error('La dirección de envío no puede estar vacía.');
    }

    localStorage.setItem('shippingAddress', normalizedAddress);
    setShippingAddress(normalizedAddress);
  };

  return (
    <UserContext.Provider value={{
      user,
      token,
      shippingAddress,
      login,
      register,
      logout,
      updateShippingAddress,
      loading,
      wishlistItems,
      wishlistProductIds,
      isWishlisted: (productId) => wishlistProductIds.includes(productId),
      isUpdatingWishlist: (productId) => pendingWishlistIds.some(
        (item) => (
          item.id === productId
          && item.sessionVersion === wishlistSessionVersionRef.current
        ),
      ),
      addToWishlist,
      removeFromWishlist,
      wishlistLoading,
      wishlistError,
    }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export default UserProvider;
