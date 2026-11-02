import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
    allowExitOnIdle: true,
});

export default pool;
