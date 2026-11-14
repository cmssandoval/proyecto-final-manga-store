import { Router } from 'express';
import { getMangas, getMangaById, createManga, updateManga, deleteManga } from '../controllers/manga.controller.js';
import asyncHandler from '../middlewares/async-handler.middleware.js';

const router = Router();

router.get('/', asyncHandler(getMangas));
router.get('/:id', asyncHandler(getMangaById));
router.post('/', asyncHandler(createManga)); 
router.put('/:id', asyncHandler(updateManga));
router.delete('/:id', asyncHandler(deleteManga));

export default router;