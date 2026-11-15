import request from 'supertest';
import { jest } from '@jest/globals';

process.env.JWT_SECRET = 'wishlist-api-test-secret';

jest.unstable_mockModule('../src/models/user.model.js', () => ({
    default: {
        findAllWishlist: jest.fn(),
        addToWishlist: jest.fn(),
    },
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
    default: { verify: jest.fn() },
}));

const { default: app } = await import('../src/app.js');
const { default: User } = await import('../src/models/user.model.js');
const { default: jwt } = await import('jsonwebtoken');

describe('Wishlist API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jwt.verify.mockReturnValue({ id: 'user-id' });
    });

    it('returns the authenticated user wishlist', async () => {
        const wishlist = [{ id: 'manga-id', name: 'Nana', slug: 'nana' }];
        User.findAllWishlist.mockResolvedValue(wishlist);

        const response = await request(app)
            .get('/api/users/me/wishlist')
            .set('Authorization', 'Bearer valid-token');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ wishlist });
        expect(User.findAllWishlist).toHaveBeenCalledWith('user-id');
    });

    it('adds a manga to the authenticated user wishlist', async () => {
        User.addToWishlist.mockResolvedValue(true);

        const response = await request(app)
            .post('/api/users/me/wishlist')
            .set('Authorization', 'Bearer valid-token')
            .send({ mangaId: 'manga-id' });

        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({ message: 'Manga added to wishlist' });
        expect(User.addToWishlist).toHaveBeenCalledWith('user-id', 'manga-id');
    });

    it('returns success when the manga is already in the wishlist', async () => {
        User.addToWishlist.mockResolvedValue(false);

        const response = await request(app)
            .post('/api/users/me/wishlist')
            .set('Authorization', 'Bearer valid-token')
            .send({ mangaId: 'manga-id' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: 'Manga added to wishlist' });
    });

    it('returns 404 when the manga does not exist', async () => {
        User.addToWishlist.mockResolvedValue(null);

        const response = await request(app)
            .post('/api/users/me/wishlist')
            .set('Authorization', 'Bearer valid-token')
            .send({ mangaId: 'missing-manga-id' });

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ message: 'Manga not found' });
    });

    it('rejects adding a manga without an id', async () => {
        const response = await request(app)
            .post('/api/users/me/wishlist')
            .set('Authorization', 'Bearer valid-token')
            .send({});

        expect(response.statusCode).toBe(400);
        expect(User.addToWishlist).not.toHaveBeenCalled();
    });

    it('requires authentication', async () => {
        const response = await request(app).get('/api/users/me/wishlist');

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ message: 'Authentication required' });
        expect(User.findAllWishlist).not.toHaveBeenCalled();
    });

    it('requires authentication to add to wishlist', async () => {
        const response = await request(app)
            .post('/api/users/me/wishlist')
            .send({ mangaId: 'manga-id' });

        expect(response.statusCode).toBe(401);
        expect(User.addToWishlist).not.toHaveBeenCalled();
    });
});
