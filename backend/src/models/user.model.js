import pool from '../database/connection.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

class User {
    static async findRoleNames(userId) {
        const query = `
            SELECT roles.name
            FROM user_role
            INNER JOIN roles ON roles.id = user_role.role_id
            WHERE user_role.user_id = $1
            ORDER BY roles.name
        `;
        const result = await pool.query(query, [userId]);
        return result.rows.map((role) => role.name);
    }

    static async hasRole(userId, roleName) {
        const query = `
            SELECT EXISTS (
                SELECT 1
                FROM user_role
                INNER JOIN roles ON roles.id = user_role.role_id
                WHERE user_role.user_id = $1 AND roles.name = $2
            ) AS has_role
        `;
        const result = await pool.query(query, [userId, roleName]);
        return result.rows[0].has_role;
    }

    static async signToken(user) {
        const { id } = user;
        const roles = await this.findRoleNames(id);
        return jwt.sign({ id, roles }, process.env.JWT_SECRET, {
            subject: String(id),
            expiresIn: 60 * 60,
            algorithm: 'HS256',
        });
    }

    static async findUserByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }

    static async findUserById(id) {
        const query = 'SELECT full_name, display_name, email FROM users WHERE id = $1';
        const result = await pool.query(query, [id]);
        const user = result.rows[0];

        if (!user) {
            return undefined;
        }

        const roles = await this.findRoleNames(id);
        return { ...user, roles };
    }

    static async findAllWishlist(userId) {
        const query = `
            SELECT
                mangas.id,
                mangas.name,
                mangas.slug,
                mangas.description,
                mangas.volume,
                mangas.author,
                mangas.editorial,
                mangas.image_link,
                mangas.sku,
                mangas.origin,
                mangas.release_date,
                mangas.price,
                mangas.stock,
                COALESCE(
                    (
                        SELECT array_agg(categories.name ORDER BY categories.name)
                        FROM manga_category
                        INNER JOIN categories ON categories.id = manga_category.category_id
                        WHERE manga_category.manga_id = mangas.id
                    ),
                    ARRAY[]::VARCHAR[]
                ) AS categories,
                COALESCE(
                    (
                        SELECT array_agg(demographic_categories.name ORDER BY demographic_categories.name)
                        FROM manga_demographic_category
                        INNER JOIN demographic_categories
                            ON demographic_categories.id = manga_demographic_category.demographic_category_id
                        WHERE manga_demographic_category.manga_id = mangas.id
                    ),
                    ARRAY[]::VARCHAR[]
                ) AS demographic_categories
            FROM wishlist
            INNER JOIN mangas ON mangas.id = wishlist.manga_id
            WHERE wishlist.user_id = $1
            ORDER BY mangas.name
        `;
        const result = await pool.query(query, [userId]);
        return result.rows;
    }

    static async addToWishlist(userId, mangaId) {
        const query = `
            WITH requested_manga AS (
                SELECT id
                FROM mangas
                WHERE id = $2
            ),
            inserted AS (
                INSERT INTO wishlist (user_id, manga_id)
                SELECT $1, requested_manga.id
                FROM requested_manga
                ON CONFLICT (user_id, manga_id) DO NOTHING
                RETURNING manga_id
            )
            SELECT
                EXISTS (SELECT 1 FROM requested_manga) AS manga_exists,
                EXISTS (SELECT 1 FROM inserted) AS added
        `;
        const result = await pool.query(query, [userId, mangaId]);
        if (!result.rows[0].manga_exists) {
            return null;
        }

        return result.rows[0].added;
    }

    static async removeFromWishlist(userId, mangaId) {
        const query = `
            DELETE FROM wishlist
            WHERE user_id = $1 AND manga_id = $2
        `;
        const result = await pool.query(query, [userId, mangaId]);
        return result.rowCount > 0;
    }

    static async createUser(userData) {
        const { full_name, display_name, email, password } = userData;
        const passwordHash = await argon2.hash(password);
        const query = `
            WITH inserted_user AS (
                INSERT INTO users (full_name, display_name, email, password)
                VALUES ($1, $2, $3, $4)
                RETURNING id, email, full_name, display_name, image_link
            ),
            resolved_role AS (
                INSERT INTO roles (name)
                VALUES ('user')
                ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
                RETURNING id
            ),
            assigned_role AS (
                INSERT INTO user_role (user_id, role_id)
                SELECT inserted_user.id, resolved_role.id
                FROM inserted_user
                CROSS JOIN resolved_role
                RETURNING user_id
            )
            SELECT
                inserted_user.id,
                inserted_user.email,
                inserted_user.full_name,
                inserted_user.display_name,
                inserted_user.image_link,
                ARRAY['user']::VARCHAR[] AS roles
            FROM inserted_user
            INNER JOIN assigned_role ON assigned_role.user_id = inserted_user.id
        `;
        const values = [full_name, display_name, email, passwordHash];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async verifyUserCredentials({ email, password }) {
        const user = await this.findUserByEmail(email);

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