import Cart from '../models/cart.model.js';
import {
    addCartItemSchema,
    cartItemParamsSchema,
    updateCartItemBodySchema,
    syncCartBodySchema,
} from '../schemas/cart.schema.js';
import parseRequest from '../utils/parse-request.js';

/** @type {import('express').RequestHandler} */
export const readCart = async (req, res) => {
    const cart = await Cart.findCartById(req.user.id);
    return res.json({ cart });
};

/** @type {import('express').RequestHandler} */
export const addCartItem = async (req, res) => {
    const input = parseRequest(addCartItemSchema, req.body, res);
    if (!input) return;

    await Cart.addItem({ userId: req.user.id, ...input });
    const cart = await Cart.findCartById(req.user.id);
    return res.status(201).json({ cart });
};

/** @type {import('express').RequestHandler} */
export const updateCartItem = async (req, res) => {
    const params = parseRequest(cartItemParamsSchema, req.params, res);
    if (!params) return;
    const body = parseRequest(updateCartItemBodySchema, req.body, res);
    if (!body) return;

    const updatedItem = await Cart.updateItem({
        userId: req.user.id,
        id: params.id,
        quantity: body.quantity,
    });
    if (!updatedItem) return res.status(404).json({ message: 'Cart item not found' });

    const cart = await Cart.findCartById(req.user.id);
    return res.json({ cart });
};

/** @type {import('express').RequestHandler} */
export const deleteCartItem = async (req, res) => {
    const params = parseRequest(cartItemParamsSchema, req.params, res);
    if (!params) return;

    const deleted = await Cart.deleteItem({ userId: req.user.id, id: params.id });
    if (!deleted) return res.status(404).json({ message: 'Cart item not found' });
    return res.status(204).end();
};

/** @type {import('express').RequestHandler} */
export const clearCart = async (req, res) => {
    await Cart.clearCart(req.user.id);
    return res.status(204).end();
};

/** @type {import('express').RequestHandler} */
export const syncCart = async (req, res) => {
    const input = parseRequest(syncCartBodySchema, req.body, res);
    if (!input) return;

    await Cart.sync({ userId: req.user.id, items: input.items });
    const cart = await Cart.findCartById(req.user.id);
    return res.json({ cart });
};
