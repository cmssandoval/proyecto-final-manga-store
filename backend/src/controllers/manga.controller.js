import Manga from '../models/manga.model.js';
import { v4 as uuidv4 } from 'uuid'; // Útil para generar los UUIDs si no los manda el cliente

export const getMangas = async (_req, res) => {
    try {
        const mangas = await Manga.findAll();
        return res.json({ mangas });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getMangaById = async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.id);
        if (!manga) return res.status(404).json({ message: 'Manga not found' });
        return res.json({ manga });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const createManga = async (req, res) => {
    try {
        const newMangaData = { id: uuidv4(), ...req.body };
        const newManga = await Manga.create(newMangaData);
        return res.status(201).json({ manga: newManga });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const updateManga = async (req, res) => {
    try {
        const updatedManga = await Manga.update(req.params.id, req.body);
        if (!updatedManga) return res.status(404).json({ message: 'Manga not found' });
        return res.json({ manga: updatedManga });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const deleteManga = async (req, res) => {
    try {
        const deleted = await Manga.delete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Manga not found' });
        return res.json({ message: 'Manga deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};