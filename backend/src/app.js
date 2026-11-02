import express from 'express';
import cors from 'cors';
import errorHandler from './middlewares/error-handler.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

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
