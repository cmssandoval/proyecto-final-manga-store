import { Router } from 'express';
import {
    getMangas,
    getCategories,
    getDemographicCategories,
    getMangaById,
    createManga,
    updateManga,
    deleteManga,
} from '../controllers/manga.controller.js';
import asyncHandler from '../middlewares/async-handler.middleware.js';
import { authGuard, authHandler, requireAdmin } from '../middlewares/auth-handler.middleware.js';

const router = Router();

router.get('/', asyncHandler(getMangas));
router.get('/categories', asyncHandler(getCategories));
router.get('/demographic-categories', asyncHandler(getDemographicCategories));
router.get('/:id', asyncHandler(getMangaById));
router.post('/', authHandler, authGuard, asyncHandler(requireAdmin), asyncHandler(createManga));
router.put('/:id', authHandler, authGuard, asyncHandler(requireAdmin), asyncHandler(updateManga));
router.delete('/:id', authHandler, authGuard, asyncHandler(requireAdmin), asyncHandler(deleteManga));

export default router;