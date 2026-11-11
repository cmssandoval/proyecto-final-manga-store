import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';

describe('GET /', () => {
    it('Retorna statusCode 200, Online y mensaje de bienvenida', async () => {
        const response = await request(app).get('/');      

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('info');
        expect(response.body.info).toHaveProperty('message');
        expect(response.body.info.message).toBe('API is running');
    });
});

describe('API endpoints not implemented', () => {
    const expectNotImplemented = (response) => {
        expect(response.statusCode).toBe(501);
        expect(response.body).toEqual({ message: 'not implemented yet' });
    };

    it('returns the placeholder response for manga endpoints', async () => {
        expectNotImplemented(await request(app).get('/mangas'));
        expectNotImplemented(await request(app).get('/mangas/test-id'));
    });

    it('returns the placeholder response for public user endpoints', async () => {
        expectNotImplemented(await request(app).post('/users/register'));
        expectNotImplemented(await request(app).post('/users/login'));
    });

    it('returns the placeholder response for the authenticated profile endpoint', async () => {
        const token = jwt.sign({ id: 'test-user' }, process.env.JWT_SECRET);
        const response = await request(app)
            .get('/users/me')
            .set('Authorization', `Bearer ${token}`);

        expectNotImplemented(response);
    });
});
