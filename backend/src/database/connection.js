import 'dotenv/config';
import dbconfig from '../config/db-config.js';
import { Pool } from 'pg';

const pool = new Pool(dbconfig);

pool.on('error', (err) => {
    console.error('Error inesperado en el pool de PostgreSQL:', err);
});

export default pool;
