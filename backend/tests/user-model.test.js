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

describe('User model', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('finds a user by email using a parameterized query', async () => {
        const user = { id: 'user-id', email: 'reader@example.com', password: 'hashed-password' };
        pool.query.mockResolvedValue({ rows: [user] });

        await expect(User.findByEmail(user.email)).resolves.toEqual(user);

        expect(pool.query).toHaveBeenCalledWith(
            'SELECT * FROM users WHERE email = $1',
            [user.email],
        );
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

        await expect(User.findById('user-id')).resolves.toEqual({
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

        await expect(User.findById('missing-id')).resolves.toBeUndefined();
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

        await expect(User.create(userData)).resolves.toEqual(createdUser);

        expect(argon2.hash).toHaveBeenCalledWith('plain-password');
        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO users'),
            ['Reader Name', 'reader', 'reader@example.com', 'hashed-password'],
        );
    });

    it('rejects login when the email is not registered without verifying a password', async () => {
        pool.query.mockResolvedValue({ rows: [] });

        await expect(User.verify({
            email: 'unknown@example.com',
            password: 'plain-password',
        })).rejects.toMatchObject({
            message: 'Invalid credentials',
            status: 401,
        });

        expect(argon2.verify).not.toHaveBeenCalled();
        expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('rejects login when the password does not match', async () => {
        pool.query.mockResolvedValue({
            rows: [{ id: 'user-id', email: 'reader@example.com', password: 'hashed-password' }],
        });
        argon2.verify.mockResolvedValue(false);

        await expect(User.verify({
            email: 'reader@example.com',
            password: 'wrong-password',
        })).rejects.toMatchObject({
            message: 'Invalid credentials',
            status: 401,
        });

        expect(argon2.verify).toHaveBeenCalledWith('hashed-password', 'wrong-password');
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
        process.env.JWT_SECRET = 'test-secret-with-more-than-thirty-two-characters';

        await expect(User.verify({
            email: 'reader@example.com',
            password: 'plain-password',
        })).resolves.toBe('signed-token');

        expect(jwt.sign).toHaveBeenCalledWith(
            { id: 'user-id' },
            process.env.JWT_SECRET,
            {
                subject: 'user-id',
                expiresIn: 60 * 60,
                algorithm: 'HS256',
            },
        );
    });
});
