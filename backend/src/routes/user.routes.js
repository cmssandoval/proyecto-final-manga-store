import { Router } from 'express';
import {
    registerUser,
    loginUser,
    getProfile,
    getUserWishlist,
    addUserWishlist,
} from '../controllers/user.controller.js';
import { authGuard, authHandler } from '../middlewares/auth-handler.middleware.js';
import asyncHandler from '../middlewares/async-handler.middleware.js';

const router = Router();

router.post('/login', asyncHandler(loginUser));
router.post('/register', asyncHandler(registerUser));
router.get('/me', authHandler, asyncHandler(getProfile));
router.get('/me/wishlist', authHandler, authGuard, asyncHandler(getUserWishlist));
router.post('/me/wishlist', authHandler, authGuard, asyncHandler(addUserWishlist));

export default router;