import request from 'supertest';

const { default: app } = await import('../src/app.js');

describe('GET /', () => {
    it('Retorna statusCode 200, Online y mensaje de bienvenida', async () => {
        const response = await request(app).get('/');

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('info');
        expect(response.body.info).toHaveProperty('message');
        expect(response.body.info.message).toBe('API is running');
    });
});
