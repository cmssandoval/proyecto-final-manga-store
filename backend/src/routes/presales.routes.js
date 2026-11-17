import { Router } from 'express';
import {
    getPresales,
    getPresaleById,
    createPresale,
} from '../controllers/presales.controller.js';
import asyncHandler from '../middlewares/async-handler.middleware.js';
import { authGuard, authHandler } from '../middlewares/auth-handler.middleware.js';

const router = Router();

router.use(authHandler, authGuard);

router.get('/', asyncHandler(getPresales));
router.get('/:id', asyncHandler(getPresaleById));
router.post('/', asyncHandler(createPresale));

export default router;
