import request from 'supertest';
import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/models/manga.model.js', () => ({
    default: {
        findAllCategories: jest.fn(),
        findAllDemographicCategories: jest.fn(),
    },
}));

const { default: app } = await import('../src/app.js');
const { default: Manga } = await import('../src/models/manga.model.js');

describe('Category API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns thematic categories', async () => {
        const categories = [{ id: 'category-id', name: 'Romance' }];
        Manga.findAllCategories.mockResolvedValue(categories);

        const response = await request(app).get('/api/mangas/categories');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ categories });
        expect(Manga.findAllCategories).toHaveBeenCalledTimes(1);
    });

    it('returns demographic categories separately', async () => {
        const categories = [{ id: 'demographic-id', name: 'Shojo' }];
        Manga.findAllDemographicCategories.mockResolvedValue(categories);

        const response = await request(app).get('/api/mangas/demographic-categories');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ categories });
        expect(Manga.findAllDemographicCategories).toHaveBeenCalledTimes(1);
    });
});
