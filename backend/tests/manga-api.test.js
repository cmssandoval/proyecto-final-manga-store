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

jest.unstable_mockModule('../src/models/user.model.js', () => ({
    default: {
        hasRole: jest.fn(),
    },
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
    default: { verify: jest.fn() },
}));

const { default: app } = await import('../src/app.js');
const { default: Manga } = await import('../src/models/manga.model.js');
const { default: User } = await import('../src/models/user.model.js');
const { default: jwt } = await import('jsonwebtoken');

describe('Manga API', () => {
    const manga = {
        id: 'manga-id',
        name: 'Black Clover',
        slug: 'black-clover',
        price: '14900.00',
        stock: 47,
    };
    const mangaInput = {
        name: 'Black Clover',
        slug: 'black-clover',
        description: 'Asta y Yuno luchan por convertirse en el Rey Mago.',
        volume: 'Vol. 12',
        author: 'Yūki Tabata',
        editorial: 'Shueisha',
        image_link: 'https://example.com/black-clover.jpg',
        sku: 'SKU52745',
        origin: 'Japón',
        release_date: '2024-01-01',
        price: 14900,
        stock: 47,
        categoryIds: [],
        demographicCategoryIds: [],
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jwt.verify.mockReturnValue({ id: 'admin-id', roles: ['admin'] });
        User.hasRole.mockResolvedValue(false);
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
        User.hasRole.mockResolvedValue(true);

        const response = await request(app)
            .post('/api/mangas')
            .set('Authorization', 'Bearer valid-token')
            .send(mangaInput);

        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({ manga });
        expect(Manga.create).toHaveBeenCalledWith(mangaInput);
    });

    it('updates a manga', async () => {
        Manga.update.mockResolvedValue(manga);
        User.hasRole.mockResolvedValue(true);

        const response = await request(app)
            .put('/api/mangas/manga-id')
            .set('Authorization', 'Bearer valid-token')
            .send({ name: manga.name });

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ manga });
        expect(Manga.update).toHaveBeenCalledWith('manga-id', { name: manga.name });
    });

    it('returns 404 when updating a manga that does not exist', async () => {
        Manga.update.mockResolvedValue(undefined);
        User.hasRole.mockResolvedValue(true);

        const response = await request(app)
            .put('/api/mangas/missing-id')
            .set('Authorization', 'Bearer valid-token')
            .send({ name: manga.name });

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ message: 'Manga not found' });
    });

    it('deletes a manga', async () => {
        Manga.delete.mockResolvedValue({ id: 'manga-id' });
        User.hasRole.mockResolvedValue(true);

        const response = await request(app)
            .delete('/api/mangas/manga-id')
            .set('Authorization', 'Bearer valid-token');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: 'Manga deleted successfully' });
        expect(Manga.delete).toHaveBeenCalledWith('manga-id');
    });

    it('returns 404 when deleting a manga that does not exist', async () => {
        Manga.delete.mockResolvedValue(undefined);
        User.hasRole.mockResolvedValue(true);

        const response = await request(app)
            .delete('/api/mangas/missing-id')
            .set('Authorization', 'Bearer valid-token');

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ message: 'Manga not found' });
    });

    it.each([
        ['creating', 'post', '/api/mangas', { name: manga.name }],
        ['updating', 'put', '/api/mangas/manga-id', { name: manga.name }],
        ['deleting', 'delete', '/api/mangas/manga-id', undefined],
    ])('requires authentication when %s a manga', async (_operation, method, path, body) => {
        let apiRequest = request(app)[method](path);
        if (body) apiRequest = apiRequest.send(body);

        const response = await apiRequest;

        expect(response.statusCode).toBe(401);
        expect(User.hasRole).not.toHaveBeenCalled();
    });

    it.each([
        ['creating', 'post', '/api/mangas', { name: manga.name }, 'create'],
        ['updating', 'put', '/api/mangas/manga-id', { name: manga.name }, 'update'],
        ['deleting', 'delete', '/api/mangas/manga-id', undefined, 'delete'],
    ])('rejects a non-admin user when %s a manga', async (_operation, method, path, body, operation) => {
        jwt.verify.mockReturnValue({ id: 'user-id', roles: ['admin'] });
        let apiRequest = request(app)[method](path)
            .set('Authorization', 'Bearer valid-token');
        if (body) apiRequest = apiRequest.send(body);

        const response = await apiRequest;

        expect(response.statusCode).toBe(403);
        expect(response.body).toEqual({ message: 'Administrator access required' });
        expect(User.hasRole).toHaveBeenCalledWith('user-id', 'admin');
        expect(Manga[operation]).not.toHaveBeenCalled();
    });
});
