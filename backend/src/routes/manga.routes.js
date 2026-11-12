import { Router } from 'express';
import { getMangas, getMangaById, createManga, updateManga, deleteManga } from '../controllers/manga.controller.js';

const router = Router();

// app.js monta este router en /api/mangas; estas rutas completan la URL.
router.get('/', getMangas);
router.get('/:id', getMangaById);
router.post('/', createManga); 
router.put('/:id', updateManga);
router.delete('/:id', deleteManga);

export default router;