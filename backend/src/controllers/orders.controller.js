import Orders from '../models/orders.model.js';
import {
    createOrderSchema,
    orderParamsSchema,
    syncOrdersSchema,
} from '../schemas/orders.schema.js';
import parseRequest from '../utils/parse-request.js';

/** @type {import('express').RequestHandler} */
export const getOrders = async (req, res) => {
    const orders = await Orders.findAllByUserId(req.user.id);
    return res.json({ orders });
};

/** @type {import('express').RequestHandler} */
export const getOrderById = async (req, res) => {
    const params = parseRequest(orderParamsSchema, req.params, res);
    if (!params) return;

    const order = await Orders.findById(params.id, req.user.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.json({ order });
};

/** @type {import('express').RequestHandler} */
export const createOrder = async (req, res) => {
    const input = parseRequest(createOrderSchema, req.body, res);
    if (!input) return;

    const orderId = await Orders.create({ userId: req.user.id, ...input });
    const order = await Orders.findById(orderId, req.user.id);
    return res.status(201).json({ order });
};

/** @type {import('express').RequestHandler} */
export const syncOrders = async (req, res) => {
    const input = parseRequest(syncOrdersSchema, req.body, res);
    if (!input) return;

    await Orders.sync({ userId: req.user.id, orders: input.orders });
    const orders = await Orders.findAllByUserId(req.user.id);
    return res.json({ orders });
};
