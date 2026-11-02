import pool from '../database/connection.js';
import argon2 from 'argon2';

class User {
    static async create( userData ) {
        const { full_name, display_name, email, password } = userData;
        const passwordHash = await argon2.hash( password );
        const query = 'INSERT INTO users (full_name, display_name, email, password) VALUES ($1, $2, $3) RETURNING *';
        const values = [full_name, display_name, email, passwordHash];
        const result = await pool.query( query, values );
        return result.rows[0];
    }
}

export default User;