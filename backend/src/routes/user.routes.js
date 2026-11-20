import { Router } from 'express';
import {
    getProfile,
    getUserWishlist,
    addUserWishlist,
    removeUserWishlist,
} from '../controllers/user.controller.js';
import { authGuard, authHandler } from '../middlewares/auth-handler.middleware.js';
import asyncHandler from '../middlewares/async-handler.middleware.js';

const router = Router();

router.get('/me', authHandler, asyncHandler(getProfile));

router.use(authHandler, authGuard);

router.get('/me/wishlist', asyncHandler(getUserWishlist));
router.post('/me/wishlist', asyncHandler(addUserWishlist));
router.delete('/me/wishlist/:mangaId', asyncHandler(removeUserWishlist));

export default router;
