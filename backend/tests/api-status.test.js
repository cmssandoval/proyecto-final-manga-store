import request from 'supertest';
import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/models/manga.model.js', () => ({
    default: {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));

const { default: app } = await import('../src/app.js');
const { default: Manga } = await import('../src/models/manga.model.js');

describe('GET /', () => {
    it('Retorna statusCode 200, Online y mensaje de bienvenida', async () => {
        const response = await request(app).get('/');      

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('info');
        expect(response.body.info).toHaveProperty('message');
        expect(response.body.info.message).toBe('API is running');
    });
});

describe('Manga API', () => {
    const manga = {
        id: 'manga-id',
        name: 'Black Clover',
        slug: 'black-clover',
        price: '14900.00',
        stock: 47,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns the list of mangas', async () => {
        Manga.findAll.mockResolvedValue([manga]);

        const response = await request(app).get('/api/mangas');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ mangas: [manga] });
        expect(Manga.findAll).toHaveBeenCalledTimes(1);
    });

    it('returns a manga by id', async () => {
        Manga.findById.mockResolvedValue(manga);

        const response = await request(app).get('/api/mangas/manga-id');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ manga });
        expect(Manga.findById).toHaveBeenCalledWith('manga-id');
    });

    it('returns 404 when the manga does not exist', async () => {
        Manga.findById.mockResolvedValue(undefined);

        const response = await request(app).get('/api/mangas/missing-id');

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ message: 'Manga not found' });
    });

    it('creates a manga', async () => {
        Manga.create.mockResolvedValue(manga);

        const response = await request(app)
            .post('/api/mangas')
            .send({ name: manga.name, slug: manga.slug });

        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({ manga });
        expect(Manga.create).toHaveBeenCalledWith({ name: manga.name, slug: manga.slug });
    });

    it('updates a manga', async () => {
        Manga.update.mockResolvedValue(manga);

        const response = await request(app)
            .put('/api/mangas/manga-id')
            .send({ name: manga.name });

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ manga });
        expect(Manga.update).toHaveBeenCalledWith('manga-id', { name: manga.name });
    });

    it('returns 404 when updating a manga that does not exist', async () => {
        Manga.update.mockResolvedValue(undefined);

        const response = await request(app)
            .put('/api/mangas/missing-id')
            .send({ name: manga.name });

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ message: 'Manga not found' });
    });

    it('deletes a manga', async () => {
        Manga.delete.mockResolvedValue({ id: 'manga-id' });

        const response = await request(app).delete('/api/mangas/manga-id');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: 'Manga deleted successfully' });
        expect(Manga.delete).toHaveBeenCalledWith('manga-id');
    });

    it('returns 404 when deleting a manga that does not exist', async () => {
        Manga.delete.mockResolvedValue(undefined);

        const response = await request(app).delete('/api/mangas/missing-id');

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ message: 'Manga not found' });
    });
});
