import pool from '../database/connection.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

class User {
    static async signToken(user) {
        const { id } = user;
        return jwt.sign({ id }, process.env.JWT_SECRET, {
            subject: String(id),
            expiresIn: 60 * 60,
            algorithm: 'HS256',
        });
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }

    static async findById(id) {
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await pool.query(query, [id]);
        const user = result.rows[0];

        if (!user) {
            return undefined;
        }

        const { full_name, display_name, email } = user;
        return { full_name, display_name, email };
    }

    static async create(userData) {
        const { full_name, display_name, email, password } = userData;
        const passwordHash = await argon2.hash(password);
        const query = `
        INSERT INTO users (full_name, display_name, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, full_name, display_name, image_link
        `;
        const values = [full_name, display_name, email, passwordHash];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async verify({ email, password }) {
        const user = await this.findByEmail(email);

        if (!user) {
            const error = new Error('Invalid credentials');
            error.status = 401;
            throw error;
        }

        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) {
            const error = new Error('Invalid credentials');
            error.status = 401;
            throw error;
        }

        const { password: _, ...cleanUser } = user;
        return this.signToken(cleanUser);
    }
}

export default User;