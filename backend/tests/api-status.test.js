import request from 'supertest';

const { default: app } = await import('../src/app.js');

describe('API Status', () => {
    it('GET / retorna statusCode 200 e información general de la API', async () => {
        const response = await request(app).get('/');

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('version');
        expect(response.body).toHaveProperty('description');
        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toBe('active');
        expect(response.body).toHaveProperty('endpoints');
        const cantidadEndpoints = Object.keys(response.body.endpoints).length;
        expect(cantidadEndpoints).toBeGreaterThan(0);
    });
    it('GET /health retorna statusCode 200, UP uptime', async () => {
        const response = await request(app).get('/health');

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toBe('UP');
        expect(response.body).toHaveProperty('uptime');
        expect(response.body.uptime).toContain('seconds');
    });
});
