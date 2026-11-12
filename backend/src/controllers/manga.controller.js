import Manga from '../models/manga.model.js';

// Los controladores conectan las solicitudes HTTP con las operaciones del modelo
// y convierten sus resultados en respuestas HTTP.
export const getMangas = async (_req, res) => {
    try {
        const mangas = await Manga.findAll();
        return res.json({ mangas });
    } catch (error) {
        // Si falla la consulta, se responde con un error del servidor.
        return res.status(500).json({ error: error.message });
    }
};

export const getMangaById = async (req, res) => {
    try {
        // El parámetro :id de la ruta llega en req.params.id.
        const manga = await Manga.findById(req.params.id);
        if (!manga) return res.status(404).json({ message: 'Manga not found' });
        return res.json({ manga });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const createManga = async (req, res) => {
    try {
        // Los datos enviados por el cliente llegan en req.body.
        const newManga = await Manga.create(req.body);
        // 201 indica que el recurso se creó correctamente.
        return res.status(201).json({ manga: newManga });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const updateManga = async (req, res) => {
    try {
        // Usa el id de la URL y los nuevos valores del cuerpo de la solicitud.
        const updatedManga = await Manga.update(req.params.id, req.body);
        if (!updatedManga) return res.status(404).json({ message: 'Manga not found' });
        return res.json({ manga: updatedManga });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const deleteManga = async (req, res) => {
    try {
        // La respuesta 404 indica que no había un manga con ese id para eliminar.
        const deleted = await Manga.delete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Manga not found' });
        return res.json({ message: 'Manga deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};