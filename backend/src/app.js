import 'dotenv/config';
import './config/env.js';
import express from 'express';
import cors from 'cors';
import errorHandler from './middlewares/error-handler.middleware.js';
import mangaRoutes from './routes/manga.routes.js';
import userRoutes from './routes/user.routes.js';   
    
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/mangas', mangaRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    return res.json({
        info: {
            status: 'Online',
            message: 'API is running',
        }
    });
});

app.use(errorHandler);

export default app;
