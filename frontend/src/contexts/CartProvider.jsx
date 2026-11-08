import { useState } from 'react';
import CartContext from './CartContext.jsx';

// import axiosClient from '../api/axiosClient.js';

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (product) => {
    const rawPrice = String(product?.price ?? '').replace(/[^\d.-]/g, '');
    const price = rawPrice ? Number(rawPrice) : Number.NaN;
    const name = product?.title || product?.name;

    if (product?.id == null || !name || !Number.isFinite(price)) {
      throw new Error('No se puede añadir al carrito un producto sin id, nombre o precio válido');
    }

    const cartItem = {
      id: product.id,
      name,
      description: product.description || product.volume || '',
      price,
      image: product.image,
    };

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === cartItem.id);

      if (!existingItem) {
        return [...currentItems, { ...cartItem, quantity: 1 }];
      }

      return currentItems.map((item) => (
        item.id === cartItem.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((currentItems) => currentItems.map((item) => (
      item.id === productId ? { ...item, quantity } : item
    )));
  };

  const createOrder = async (shippingAddress) => {
    const address = shippingAddress.trim();

    if (!address) {
      throw new Error('Agrega una dirección de envío antes de confirmar la compra.');
    }

    if (cartItems.length === 0) {
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
      items: cartItems.map((item) => ({ ...item })),
      total: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
      status: 'Confirmada',
    };

    setOrders((currentOrders) => [order, ...currentOrders]);
    setCartItems([]);

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