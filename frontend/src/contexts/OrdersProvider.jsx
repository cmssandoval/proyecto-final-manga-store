import { useEffect, useRef, useState } from 'react';
import OrdersContext from './OrdersContext.jsx';
import axiosClient from '../api/axiosClient.js';
import useUserContext from '../hooks/useUserContext.js';
import calculateOrderTotals from '../utils/calculateOrderTotals.js';

const GUEST_ORDERS_STORAGE_KEY = 'guestOrders';

const getErrorMessage = (error, fallbackMessage = 'No se pudieron cargar las órdenes.') => (
  error.response?.data?.message || error.message || fallbackMessage
);

const normalizeOrder = (order) => {
  if (!order || typeof order !== 'object' || !Array.isArray(order.items)) {
    throw new Error('La respuesta de órdenes no tiene un formato válido.');
  }

  const total = Number(order.total);
  const netAmount = Number(order.netAmount);
  const taxAmount = Number(order.taxAmount);
  if (
    typeof order.id !== 'string'
    || !order.id
    || typeof order.orderNumber !== 'string'
    || !order.orderNumber
    || typeof order.currency !== 'string'
    || !Number.isFinite(total)
    || total < 0
    || !Number.isFinite(netAmount)
    || netAmount < 0
    || !Number.isFinite(taxAmount)
    || taxAmount < 0
    || typeof order.status !== 'string'
    || typeof order.shippingAddress !== 'string'
    || !order.shippingAddress.trim()
    || !Number.isFinite(Date.parse(order.createdAt))
  ) {
    throw new Error('La respuesta de órdenes no tiene un formato válido.');
  }

  const items = order.items.map((item) => {
    const price = Number(item?.price);
    const quantity = Number(item?.quantity);
    if (
      !item
      || typeof item.id !== 'string'
      || typeof item.name !== 'string'
      || !item.name
      || !Number.isFinite(price)
      || price < 0
      || !Number.isInteger(quantity)
      || quantity <= 0
    ) {
      throw new Error('La respuesta de órdenes contiene un elemento inválido.');
    }

    return {
      id: item.id,
      mangaId: item.mangaId,
      name: item.name,
      price,
      quantity,
      image: item.image || '',
    };
  });

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    createdAt: order.createdAt,
    shippingAddress: order.shippingAddress,
    status: order.status,
    currency: order.currency,
    netAmount,
    taxAmount,
    total,
    items,
  };
};

const normalizeOrders = (orders) => {
  if (!Array.isArray(orders)) {
    throw new Error('La respuesta de órdenes no tiene un formato válido.');
  }
  return orders.map(normalizeOrder);
};

const readGuestOrders = () => {
  const storedOrders = localStorage.getItem(GUEST_ORDERS_STORAGE_KEY);
  if (!storedOrders) return [];

  return normalizeOrders(JSON.parse(storedOrders));
};

const mergeOrders = (...groups) => {
  const ordersById = new Map();
  groups.forEach((orders) => {
    orders.forEach((order) => ordersById.set(order.orderNumber || order.id, order));
  });
  return [...ordersById.values()].sort(
    (first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt),
  );
};

const createGuestOrder = ({ shippingAddress, items }) => {
  const orderItems = items.map((item) => {
    const price = Number(item?.price);
    const quantity = Number(item?.quantity);
    if (
      !item
      || typeof item.id !== 'string'
      || typeof item.name !== 'string'
      || !Number.isFinite(price)
      || price < 0
      || !Number.isInteger(quantity)
      || quantity <= 0
    ) {
      throw new Error('El carrito contiene un elemento inválido para crear la orden.');
    }

    return {
      id: item.id,
      mangaId: item.id,
      name: item.name,
      image: item.image || '',
      price,
      quantity,
    };
  });
  const { netAmount, taxAmount, total } = calculateOrderTotals(orderItems);
  const id = `GUEST-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return normalizeOrder({
    id,
    orderNumber: id,
    createdAt: new Date().toISOString(),
    shippingAddress,
    status: 'pendiente',
    currency: 'CLP',
    netAmount,
    taxAmount,
    total,
    items: orderItems,
  });
};

const OrdersProvider = ({ children }) => {
  const { token } = useUserContext();
  const [orders, setOrders] = useState([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [hasPendingGuestOrders, setHasPendingGuestOrders] = useState(false);
  const [syncAttempt, setSyncAttempt] = useState(0);
  const ordersRef = useRef([]);
  const sessionVersionRef = useRef(0);

  useEffect(() => {
    let isCurrent = true;
    const sessionVersion = ++sessionVersionRef.current;
    ordersRef.current = [];

    const loadOrders = async () => {
      setOrders([]);
      setIsOrdersLoading(true);
      setOrdersError('');
      setHasPendingGuestOrders(false);

      let guestOrders = [];
      try {
        let nextOrders;
        if (token) {
          guestOrders = readGuestOrders();
          if (guestOrders.length > 0) {
            try {
              const response = await axiosClient.post('/orders/sync', {
                orders: guestOrders.map((order) => ({
                  guestOrderId: order.orderNumber,
                  shippingAddress: order.shippingAddress,
                  items: order.items.map((item) => ({
                    mangaId: item.mangaId || item.id,
                    quantity: item.quantity,
                  })),
                })),
              });
              nextOrders = normalizeOrders(response.data?.orders);
              localStorage.removeItem(GUEST_ORDERS_STORAGE_KEY);
            } catch (syncError) {
              let accountOrders = [];
              let syncErrorMessage = getErrorMessage(
                syncError,
                'No se pudieron sincronizar las órdenes de invitado.',
              );

              try {
                const response = await axiosClient.get('/orders');
                accountOrders = normalizeOrders(response.data?.orders);
              } catch (loadError) {
                syncErrorMessage = `${syncErrorMessage} ${getErrorMessage(loadError)}`;
              }

              if (isCurrent && sessionVersion === sessionVersionRef.current) {
                ordersRef.current = mergeOrders(guestOrders, accountOrders);
                setOrders(ordersRef.current);
                setOrdersError(syncErrorMessage);
                setHasPendingGuestOrders(true);
              }
              return;
            }
          } else {
            const response = await axiosClient.get('/orders');
            nextOrders = normalizeOrders(response.data?.orders);
          }
        } else {
          nextOrders = guestOrders = readGuestOrders();
        }

        if (isCurrent && sessionVersion === sessionVersionRef.current) {
          ordersRef.current = mergeOrders(nextOrders, ordersRef.current);
          setOrders(ordersRef.current);
          setHasPendingGuestOrders(false);
        }
      } catch (error) {
        if (isCurrent && sessionVersion === sessionVersionRef.current) {
          ordersRef.current = mergeOrders(guestOrders, ordersRef.current);
          setOrders(ordersRef.current);
          setOrdersError(getErrorMessage(error));
          setHasPendingGuestOrders(Boolean(token && guestOrders.length > 0));
        }
      } finally {
        if (isCurrent && sessionVersion === sessionVersionRef.current) {
          setIsOrdersLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      isCurrent = false;
    };
  }, [token, syncAttempt]);

  const retryGuestOrderSync = () => {
    setSyncAttempt((currentAttempt) => currentAttempt + 1);
  };

  const createOrder = async ({ shippingAddress, items }) => {
    if (typeof shippingAddress !== 'string' || !shippingAddress.trim()) {
      throw new Error('Agrega una dirección de envío antes de confirmar la compra.');
    }
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('No puedes crear una orden con el carrito vacío.');
    }

    const sessionVersion = sessionVersionRef.current;
    setOrdersError('');

    try {
      let order;
      if (token) {
        const response = await axiosClient.post('/orders', {
          shippingAddress: shippingAddress.trim(),
          items: items.map((item) => ({
            mangaId: item.id,
            quantity: item.quantity,
          })),
        });
        order = normalizeOrder(response.data?.order);
      } else {
        order = createGuestOrder({ shippingAddress: shippingAddress.trim(), items });
      }

      if (sessionVersion !== sessionVersionRef.current) {
        throw new Error('La sesión cambió mientras se procesaba la orden. Verifica tus órdenes antes de reintentar.');
      }

      const nextOrders = mergeOrders(ordersRef.current, [order]);
      if (!token) {
        localStorage.setItem(GUEST_ORDERS_STORAGE_KEY, JSON.stringify(nextOrders));
      }
      ordersRef.current = nextOrders;
      setOrders(nextOrders);
      return order;
    } catch (error) {
      const message = getErrorMessage(error, 'No se pudo crear la orden.');
      setOrdersError(message);
      throw new Error(message);
    }
  };

  return (
    <OrdersContext.Provider value={{
      orders,
      isOrdersLoading,
      ordersError,
      hasPendingGuestOrders,
      retryGuestOrderSync,
      createOrder,
    }}>
      {children}
    </OrdersContext.Provider>
  );
};

export default OrdersProvider;
