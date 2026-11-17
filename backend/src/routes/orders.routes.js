import { Router } from 'express';
import {
    getOrders,
    getOrderById,
    createOrder,
    syncOrders,
} from '../controllers/orders.controller.js';
import asyncHandler from '../middlewares/async-handler.middleware.js';
import { authGuard, authHandler } from '../middlewares/auth-handler.middleware.js';

const router = Router();

router.use(authHandler, authGuard);

router.get('/', asyncHandler(getOrders));
router.post('/sync', asyncHandler(syncOrders));
router.get('/:id', asyncHandler(getOrderById));
router.post('/', asyncHandler(createOrder));

export default router;
