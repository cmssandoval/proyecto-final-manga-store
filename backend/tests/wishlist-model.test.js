import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/database/connection.js', () => ({
    default: { query: jest.fn() },
}));
jest.unstable_mockModule('argon2', () => ({
    default: {
        hash: jest.fn(),
        verify: jest.fn(),
    },
}));
jest.unstable_mockModule('jsonwebtoken', () => ({
    default: { sign: jest.fn() },
}));

const { default: User } = await import('../src/models/user.model.js');
const { default: pool } = await import('../src/database/connection.js');

describe('Wishlist model', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns wishlist items with their manga categories', async () => {
        const wishlist = [{ id: 'manga-id', name: 'Nana', categories: ['Drama'] }];
        pool.query.mockResolvedValue({ rows: wishlist });

        await expect(User.findAllWishlist('user-id')).resolves.toEqual(wishlist);

        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('FROM wishlist'),
            ['user-id'],
        );
    });

    it('adds a manga without duplicating existing entries', async () => {
        pool.query.mockResolvedValue({ rows: [{ manga_exists: true, added: true }] });

        await expect(User.addToWishlist('user-id', 'manga-id')).resolves.toBe(true);

        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('ON CONFLICT (user_id, manga_id) DO NOTHING'),
            ['user-id', 'manga-id'],
        );

        pool.query.mockResolvedValue({ rows: [{ manga_exists: true, added: false }] });
        await expect(User.addToWishlist('user-id', 'manga-id')).resolves.toBe(false);

        pool.query.mockResolvedValue({ rows: [{ manga_exists: false, added: false }] });
        await expect(User.addToWishlist('user-id', 'missing-manga-id')).resolves.toBeNull();
    });

    it('removes a manga only from the specified user wishlist', async () => {
        pool.query.mockResolvedValue({ rowCount: 1 });

        await expect(User.removeFromWishlist('user-id', 'manga-id')).resolves.toBe(true);

        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('DELETE FROM wishlist'),
            ['user-id', 'manga-id'],
        );
    });

    it('returns false when the manga was not in the wishlist', async () => {
        pool.query.mockResolvedValue({ rowCount: 0 });

        await expect(User.removeFromWishlist('user-id', 'manga-id')).resolves.toBe(false);
    });
});
