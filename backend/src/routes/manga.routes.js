import { Router } from 'express';
import { getMangas, getMangaById } from '../controllers/manga.controller.js';

const router = Router();

router.get('/', getMangas);
router.get('/:id', getMangaById);

export default router;