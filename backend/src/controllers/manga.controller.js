import Manga from '../models/manga.model.js';

/** @type {import('express').RequestHandler} */
export const getMangas = async (_req, res) => {
    const mangas = await Manga.findAll();
    return res.json({ mangas });
};

/** @type {import('express').RequestHandler} */
export const getCategories = async (_req, res) => {
    const categories = await Manga.findAllCategories();
    return res.json({ categories });
};

/** @type {import('express').RequestHandler} */
export const getDemographicCategories = async (_req, res) => {
    const categories = await Manga.findAllDemographicCategories();
    return res.json({ categories });
};

/** @type {import('express').RequestHandler} */
export const getMangaById = async (req, res) => {
    const manga = await Manga.findById(req.params.id);
    if (!manga) return res.status(404).json({ message: 'Manga not found' });
    return res.json({ manga });
};

/** @type {import('express').RequestHandler} */
export const createManga = async (req, res) => {
    const newManga = await Manga.create(req.body);
    return res.status(201).json({ manga: newManga });
};

/** @type {import('express').RequestHandler} */
export const updateManga = async (req, res) => {
    const updatedManga = await Manga.update(req.params.id, req.body);
    if (!updatedManga) return res.status(404).json({ message: 'Manga not found' });
    return res.json({ manga: updatedManga });
};

/** @type {import('express').RequestHandler} */
export const deleteManga = async (req, res) => {
    const deleted = await Manga.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Manga not found' });
    return res.json({ message: 'Manga deleted successfully' });        return res.status(500).json({ error: error.message });
};
