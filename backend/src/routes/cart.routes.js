import { Router } from 'express';
import {
    readCart,
    addCartItem,
    updateCartItem,
    deleteCartItem,
    clearCart,
    syncCart,
} from '../controllers/cart.controller.js';
import asyncHandler from '../middlewares/async-handler.middleware.js';
import { authGuard, authHandler } from '../middlewares/auth-handler.middleware.js';

const router = Router();

router.use(authHandler, authGuard);

router.get('/', asyncHandler(readCart));
router.post('/', asyncHandler(addCartItem));
router.post('/sync', asyncHandler(syncCart));
router.delete('/', asyncHandler(clearCart));
router.put('/:id', asyncHandler(updateCartItem));
router.delete('/:id', asyncHandler(deleteCartItem));

export default router;
