import { useEffect, useRef, useState } from 'react';
import CartContext from './CartContext.jsx';
import axiosClient from '../api/axiosClient.js';
import useUserContext from '../hooks/useUserContext.js';

const GUEST_CART_STORAGE_KEY = 'cartItems';

const readGuestCart = () => {
  const storedCart = localStorage.getItem(GUEST_CART_STORAGE_KEY);
  if (!storedCart) return [];

  const items = JSON.parse(storedCart);
  if (!Array.isArray(items)) {
    throw new Error('El carrito guardado no tiene un formato válido.');
  }
  return items;
};

const normalizeApiCart = (cart) => {
  if (!cart || !Array.isArray(cart.items)) {
    throw new Error('La respuesta del carrito no tiene un formato válido.');
  }

  return cart.items.map((item) => ({
    id: item.id,
    cartItemId: item.cart_item_id,
    name: item.name,
    description: item.description || item.volume || '',
    price: Number(item.price),
    stock: Number(item.stock),
    image: item.image_link || '',
    quantity: Number(item.quantity),
  }));
};

const getErrorMessage = (error) => (
  error.response?.data?.message || error.message || 'No se pudo actualizar el carrito.'
);

const CartProvider = ({ children }) => {
  const { token } = useUserContext();
  const [cartItems, setCartItems] = useState([]);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [cartError, setCartError] = useState('');
  const cartItemsRef = useRef([]);
  const sessionVersionRef = useRef(0);
  const cartRevisionRef = useRef(0);
  const guestSyncRef = useRef(null);

  const commitCartItems = (nextItems) => {
    if (!token) {
      localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(nextItems));
    }
    cartItemsRef.current = nextItems;
    setCartItems(nextItems);
  };

  useEffect(() => {
    let isCurrent = true;
    const sessionVersion = ++sessionVersionRef.current;
    const cartRevision = cartRevisionRef.current;

    const loadCart = async () => {
      setIsCartLoading(true);
      setCartError('');

      try {
        if (!token) {
          const guestItems = readGuestCart();
          if (isCurrent && sessionVersion === sessionVersionRef.current) {
            cartItemsRef.current = guestItems;
            setCartItems(guestItems);
          }
          return;
        }

        const guestItems = readGuestCart();
        let response;

        if (guestItems.length > 0) {
          const fingerprint = JSON.stringify(
            guestItems.map(({ id, quantity }) => ({ id, quantity })),
          );
          const pendingSync = guestSyncRef.current;

          if (pendingSync?.token === token && pendingSync.fingerprint === fingerprint) {
            response = await pendingSync.promise;
          } else {
            const promise = axiosClient.post('/cart/sync', {
              items: guestItems.map((item) => ({
                mangaId: item.id,
                quantity: item.quantity,
              })),
            });
            guestSyncRef.current = { token, fingerprint, promise };
            response = await promise;
          }

          localStorage.removeItem(GUEST_CART_STORAGE_KEY);
        } else {
          response = await axiosClient.get('/cart');
        }

        const nextItems = normalizeApiCart(response.data?.cart);
        if (
          isCurrent &&
          sessionVersion === sessionVersionRef.current &&
          cartRevision === cartRevisionRef.current
        ) {
          cartItemsRef.current = nextItems;
          setCartItems(nextItems);
        }
      } catch (error) {
        if (
          isCurrent &&
          sessionVersion === sessionVersionRef.current &&
          cartRevision === cartRevisionRef.current
        ) {
          const message = getErrorMessage(error);
          setCartError(message);

          if (token) {
            try {
              const response = await axiosClient.get('/cart');
              const serverItems = normalizeApiCart(response.data?.cart);
              if (
                isCurrent &&
                sessionVersion === sessionVersionRef.current &&
                cartRevision === cartRevisionRef.current
              ) {
                cartItemsRef.current = serverItems;
                setCartItems(serverItems);
              }
            } catch (loadError) {
              if (isCurrent && sessionVersion === sessionVersionRef.current) {
                setCartError(`${message} ${getErrorMessage(loadError)}`);
              }
            }
          }
        }
      } finally {
        if (
          isCurrent &&
          sessionVersion === sessionVersionRef.current &&
          cartRevision === cartRevisionRef.current
        ) {
          setIsCartLoading(false);
        }
      }
    };

    loadCart();

    return () => {
      isCurrent = false;
    };
  }, [token]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const addToCart = async (product) => {
    const rawPrice = String(product?.price ?? '').replace(/[^\d.-]/g, '');
    const price = rawPrice ? Number(rawPrice) : Number.NaN;
    const name = product?.title || product?.name;
    const stock = Number(product?.stock);

    if (product?.id == null || !name || !Number.isFinite(price) || !Number.isInteger(stock) || stock < 0) {
      throw new Error('No se puede añadir al carrito un producto con datos inválidos');
    }

    if (stock === 0) return false;

    const currentItems = cartItemsRef.current;
    const existingItem = currentItems.find((item) => item.id === product.id);
    if (existingItem && existingItem.quantity >= stock) return false;

    if (token) {
      try {
        const response = await axiosClient.post('/cart', { mangaId: product.id });
        const nextItems = normalizeApiCart(response.data?.cart);
        cartRevisionRef.current += 1;
        cartItemsRef.current = nextItems;
        setCartItems(nextItems);
        setCartError('');
        setIsCartLoading(false);
        return true;
      } catch (error) {
        const message = getErrorMessage(error);
        setCartError(message);
        setIsCartLoading(false);
        throw new Error(message);
      }
    }

    const cartItem = {
      id: product.id,
      name,
      description: product.description || product.volume || '',
      price,
      stock,
      image: product.image_link || product.image || '',
    };
    const nextItems = existingItem
      ? currentItems.map((item) => (
        item.id === cartItem.id
          ? { ...item, quantity: item.quantity + 1, stock: cartItem.stock }
          : item
      ))
      : [...currentItems, { ...cartItem, quantity: 1 }];

    commitCartItems(nextItems);
    setCartError('');
    setIsCartLoading(false);
    return true;
  };

  const removeFromCart = async (productId) => {
    const item = cartItemsRef.current.find((cartItem) => cartItem.id === productId);
    if (!item) return false;

    if (token) {
      if (!item.cartItemId) {
        throw new Error('No se pudo identificar el elemento persistido del carrito.');
      }

      try {
        await axiosClient.delete(`/cart/${encodeURIComponent(item.cartItemId)}`);
      } catch (error) {
        const message = getErrorMessage(error);
        setCartError(message);
        setIsCartLoading(false);
        throw new Error(message);
      }
    }

    const nextItems = cartItemsRef.current.filter((cartItem) => cartItem.id !== productId);
    cartRevisionRef.current += 1;
    commitCartItems(nextItems);
    setCartError('');
    setIsCartLoading(false);
    return true;
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    const item = cartItemsRef.current.find((cartItem) => cartItem.id === productId);
    if (!item || quantity > item.stock) return false;

    if (token) {
      if (!item.cartItemId) {
        throw new Error('No se pudo identificar el elemento persistido del carrito.');
      }

      try {
        const response = await axiosClient.put(
          `/cart/${encodeURIComponent(item.cartItemId)}`,
          { quantity },
        );
        const nextItems = normalizeApiCart(response.data?.cart);
        cartRevisionRef.current += 1;
        cartItemsRef.current = nextItems;
        setCartItems(nextItems);
        setCartError('');
        setIsCartLoading(false);
        return true;
      } catch (error) {
        const message = getErrorMessage(error);
        setCartError(message);
        setIsCartLoading(false);
        throw new Error(message);
      }
    }

    const nextItems = cartItemsRef.current.map((cartItem) => (
      cartItem.id === productId ? { ...cartItem, quantity } : cartItem
    ));
    commitCartItems(nextItems);
    setCartError('');
    setIsCartLoading(false);
    return true;
  };

  const clearCart = async ({ remoteAlreadyCleared = false } = {}) => {
    try {
      if (token && !remoteAlreadyCleared) {
        await axiosClient.delete('/cart');
      }
      if (!token || remoteAlreadyCleared) {
        localStorage.removeItem(GUEST_CART_STORAGE_KEY);
      }
    } catch (error) {
      const message = getErrorMessage(error);
      setCartError(message);
      throw new Error(message);
    }

    cartRevisionRef.current += 1;
    cartItemsRef.current = [];
    setCartItems([]);
    setCartError('');
    setIsCartLoading(false);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      isCartLoading,
      cartError,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
