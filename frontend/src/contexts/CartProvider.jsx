import { useRef, useState } from 'react';
import CartContext from './CartContext.jsx';

// import axiosClient from '../api/axiosClient.js';

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const cartItemsRef = useRef([]);

  const commitCartItems = (nextItems) => {
    cartItemsRef.current = nextItems;
    setCartItems(nextItems);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (product) => {
    const rawPrice = String(product?.price ?? '').replace(/[^\d.-]/g, '');
    const price = rawPrice ? Number(rawPrice) : Number.NaN;
    const name = product?.title || product?.name;
    const stock = Number(product?.stock);

    if (product?.id == null || !name || !Number.isFinite(price) || !Number.isInteger(stock) || stock < 0) {
      throw new Error('No se puede añadir al carrito un producto con datos inválidos');
    }

    if (stock === 0) {
      return false;
    }

    const cartItem = {
      id: product.id,
      name,
      description: product.description || product.volume || '',
      price,
      stock,
      image: product.image_link || product.image,
    };

    const currentItems = cartItemsRef.current;
    const existingItem = currentItems.find((item) => item.id === cartItem.id);
    if (existingItem && existingItem.quantity >= stock) {
      return false;
    }

    const nextItems = existingItem
      ? currentItems.map((item) => (
        item.id === cartItem.id
          ? { ...item, quantity: item.quantity + 1, stock: cartItem.stock }
          : item
      ))
      : [...currentItems, { ...cartItem, quantity: 1 }];

    commitCartItems(nextItems);
    return true;
  };

  const removeFromCart = (productId) => {
    commitCartItems(cartItemsRef.current.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const cartItem = cartItemsRef.current.find((item) => item.id === productId);
    if (!cartItem || quantity > cartItem.stock) {
      return;
    }

    commitCartItems(cartItemsRef.current.map((item) => (
      item.id === productId ? { ...item, quantity } : item
    )));
  };

  const createOrder = async (shippingAddress) => {
    const address = shippingAddress.trim();
    const currentItems = cartItemsRef.current;

    if (!address) {
      throw new Error('Agrega una dirección de envío antes de confirmar la compra.');
    }

    if (currentItems.length === 0) {
      throw new Error('No puedes crear una orden con el carrito vacío.');
    }

    // * Llamada a la API, descomentar una vez evaluado el frontend.
    // const response = await axiosClient.post('/orders', {
    //   shippingAddress: address,
    //   items: cartItems,
    //   total: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    // });

    const order = {
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      shippingAddress: address,
      items: currentItems.map((item) => ({ ...item })),
      total: currentItems.reduce((total, item) => total + item.price * item.quantity, 0),
      status: 'Confirmada',
    };

    setOrders((currentOrders) => [order, ...currentOrders]);
    commitCartItems([]);

    return order;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      orders,
      addToCart,
      removeFromCart,
      updateQuantity,
      createOrder,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;