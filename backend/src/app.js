import express from 'express';

import helmetHandler from '../src/middlewares/helmet-handler.middleware.js';
import corsHandler from '../src/middlewares/cors-handler.middleware.js';
import errorHandler from './middlewares/error-handler.middleware.js';
import morganHandler from './middlewares/morgan-handler.middleware.js'

import mangaRoutes from './routes/manga.routes.js';
import userRoutes from './routes/user.routes.js';
import cartRoutes from './routes/cart.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import presalesRoutes from './routes/presales.routes.js';

import getBaseUrl from './utils/getRequestBaseUrl.js';

const app = express();

app.use(morganHandler)
app.use(helmetHandler);
app.use(corsHandler);
app.use(express.json());
app.use('/api/mangas', mangaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/presales', presalesRoutes);

app.get('/', (req, res) => {
    return res.json({
        name: 'Moonshelf API',
        version: '1.0.0',
        description: 'API principal para la gestión de usuarios, autenticación y productos del marketplace Moonshelf.',
        status: 'active',
        endpoints: {
            health: `${getBaseUrl(req)}/health`,
            users: `${getBaseUrl(req)}/api/users`,
            mangas: `${getBaseUrl(req)}/api/mangas`,
        }
    });
});

app.get('/health', (req, res) => {
    return res.json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptime: `${process.uptime()} seconds`,
    });
});

app.use(errorHandler);

export default app;
