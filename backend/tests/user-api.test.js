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
const { default: argon2 } = await import('argon2');
const { default: jwt } = await import('jsonwebtoken');

const originalJwtSecret = process.env.JWT_SECRET;

describe('User API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        if (originalJwtSecret === undefined) {
            delete process.env.JWT_SECRET;
        } else {
            process.env.JWT_SECRET = originalJwtSecret;
        }
    });

    it('finds a user by email using a parameterized query', async () => {
        const user = { id: 'user-id', email: 'reader@example.com', password: 'hashed-password' };
        pool.query.mockResolvedValue({ rows: [user] });

        await expect(User.findUserByEmail(user.email)).resolves.toEqual(user);

        expect(pool.query).toHaveBeenCalledWith(
            'SELECT * FROM users WHERE email = $1',
            [user.email],
        );
    });

    it('returns undefined when no user has the requested email', async () => {
        pool.query.mockResolvedValue({ rows: [] });

        await expect(User.findUserByEmail('missing@example.com')).resolves.toBeUndefined();
    });

    it('returns the public profile fields for a user id', async () => {
        pool.query.mockResolvedValue({
            rows: [{
                id: 'user-id',
                full_name: 'Reader Name',
                display_name: 'reader',
                email: 'reader@example.com',
                password: 'hashed-password',
            }],
        });

        await expect(User.findUserById('user-id')).resolves.toEqual({
            full_name: 'Reader Name',
            display_name: 'reader',
            email: 'reader@example.com',
        });
        expect(pool.query).toHaveBeenCalledWith(
            'SELECT * FROM users WHERE id = $1',
            ['user-id'],
        );
    });

    it('returns undefined when the user id does not exist', async () => {
        pool.query.mockResolvedValue({ rows: [] });

        await expect(User.findUserById('missing-id')).resolves.toBeUndefined();
    });

    it('returns a user wishlist with the manga category arrays', async () => {
        const wishlist = [{ id: 'manga-id', name: 'Nana', categories: ['Drama'] }];
        pool.query.mockResolvedValue({ rows: wishlist });

        await expect(User.findAllWishlist('user-id')).resolves.toEqual(wishlist);

        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('FROM wishlist'),
            ['user-id'],
        );
    });

    it('adds a manga to a wishlist without duplicating existing entries', async () => {
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

    it('hashes the password before inserting a user', async () => {
        const userData = {
            full_name: 'Reader Name',
            display_name: 'reader',
            email: 'reader@example.com',
            password: 'plain-password',
        };
        const createdUser = {
            id: 'user-id',
            email: userData.email,
            full_name: userData.full_name,
            display_name: userData.display_name,
            image_link: null,
        };
        argon2.hash.mockResolvedValue('hashed-password');
        pool.query.mockResolvedValue({ rows: [createdUser] });

        await expect(User.createUser(userData)).resolves.toEqual(createdUser);

        expect(argon2.hash).toHaveBeenCalledWith('plain-password');
        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO users'),
            ['Reader Name', 'reader', 'reader@example.com', 'hashed-password'],
        );
    });

    it('does not insert a user when password hashing fails', async () => {
        const hashingError = new Error('Hashing failed');
        argon2.hash.mockRejectedValue(hashingError);

        await expect(User.createUser({
            full_name: 'Reader Name',
            display_name: 'reader',
            email: 'reader@example.com',
            password: 'plain-password',
        })).rejects.toBe(hashingError);

        expect(pool.query).not.toHaveBeenCalled();
    });

    it('rejects login when the email is not registered without verifying a password', async () => {
        pool.query.mockResolvedValue({ rows: [] });

        await expect(User.verifyUserCredentials({
            email: 'unknown@example.com',
            password: 'plain-password',
        })).rejects.toMatchObject({
            message: 'Invalid credentials',
            status: 401,
        });

        expect(pool.query).toHaveBeenCalledWith(
            'SELECT * FROM users WHERE email = $1',
            ['unknown@example.com'],
        );
        expect(argon2.verify).not.toHaveBeenCalled();
        expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('rejects login when the password does not match', async () => {
        pool.query.mockResolvedValue({
            rows: [{ id: 'user-id', email: 'reader@example.com', password: 'hashed-password' }],
        });
        argon2.verify.mockResolvedValue(false);

        await expect(User.verifyUserCredentials({
            email: 'reader@example.com',
            password: 'wrong-password',
        })).rejects.toMatchObject({
            message: 'Invalid credentials',
            status: 401,
        });

        expect(argon2.verify).toHaveBeenCalledWith('hashed-password', 'wrong-password');
        expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('propagates password verification errors', async () => {
        const verificationError = new Error('Verification failed');
        pool.query.mockResolvedValue({
            rows: [{ id: 'user-id', email: 'reader@example.com', password: 'hashed-password' }],
        });
        argon2.verify.mockRejectedValue(verificationError);

        await expect(User.verifyUserCredentials({
            email: 'reader@example.com',
            password: 'plain-password',
        })).rejects.toBe(verificationError);

        expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('returns a signed token when credentials are valid', async () => {
        pool.query.mockResolvedValue({
            rows: [{
                id: 'user-id',
                email: 'reader@example.com',
                password: 'hashed-password',
            }],
        });
        argon2.verify.mockResolvedValue(true);
        jwt.sign.mockReturnValue('signed-token');
        const jwtSecret = 'test-secret-with-more-than-thirty-two-characters';
        process.env.JWT_SECRET = jwtSecret;

        await expect(User.verifyUserCredentials({
            email: 'reader@example.com',
            password: 'plain-password',
        })).resolves.toBe('signed-token');

        expect(argon2.verify).toHaveBeenCalledWith('hashed-password', 'plain-password');
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: 'user-id' },
            jwtSecret,
            {
                subject: 'user-id',
                expiresIn: 60 * 60,
                algorithm: 'HS256',
            },
        );
    });

    it('signs a token using the user id and configured secret', async () => {
        jwt.sign.mockReturnValue('signed-token');
        process.env.JWT_SECRET = 'configured-secret';

        await expect(User.signToken({ id: 42, email: 'reader@example.com' }))
            .resolves.toBe('signed-token');

        expect(jwt.sign).toHaveBeenCalledWith(
            { id: 42 },
            'configured-secret',
            {
                subject: '42',
                expiresIn: 60 * 60,
                algorithm: 'HS256',
            },
        );
    });
});
