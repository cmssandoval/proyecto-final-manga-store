import pool from '../database/connection.js';
import AppError from '../utils/app-error.js';

const mangaQuery = `
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
    FROM mangas
`;

class Manga {
    static async assertCategoriesExist(client, tableName, ids, message) {
        if (ids.length === 0) return;

        const result = await client.query(
            `SELECT id FROM ${tableName} WHERE id = ANY($1::uuid[])`,
            [ids],
        );
        if (result.rowCount !== ids.length) {
            throw new AppError(message, 400);
        }
    }

    static async findAll() {
        const result = await pool.query(`${mangaQuery} ORDER BY mangas.name`);
        return result.rows;
    }

    static async findAllCategories() {
        try {
            const result = await pool.query('SELECT * FROM categories ORDER BY categories.name');
            return result.rows;
        } catch {
            const error = new Error('Error. Categories not found');
            error.status = 404;
            throw error;
        }
    }

    static async findAllDemographicCategories() {
        try {
            const result = await pool.query('SELECT * FROM demographic_categories ORDER BY demographic_categories.name');
            return result.rows;
        } catch {
            const error = new Error('Error. Demographic Categories not found');
            error.status = 404;
            throw error;
        }
    }

    static async findById(id) {
        const result = await pool.query(`${mangaQuery} WHERE mangas.id = $1`, [id]);
        return result.rows[0];
    }

    static async create(data) {
        const {
            name,
            slug,
            description,
            volume,
            author,
            editorial,
            image_link,
            sku,
            origin,
            release_date,
            price,
            stock,
            categoryIds = [],
            demographicCategoryIds = [],
        } = data;
        const query = `
            INSERT INTO mangas (name, slug, description, volume, author, editorial, image_link, sku, origin, release_date, price, stock)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *;
        `;
        const values = [name, slug, description, volume, author, editorial, image_link, sku, origin, release_date, price, stock];
        const client = await pool.connect();
        let transactionStarted = false;

        try {
            await client.query('BEGIN');
            transactionStarted = true;

            await this.assertCategoriesExist(
                client,
                'categories',
                categoryIds,
                'One or more categories were not found',
            );
            await this.assertCategoriesExist(
                client,
                'demographic_categories',
                demographicCategoryIds,
                'One or more demographic categories were not found',
            );

            const result = await client.query(query, values);
            const mangaId = result.rows[0].id;

            if (categoryIds.length > 0) {
                await client.query(
                    `INSERT INTO manga_category (manga_id, category_id)
                     SELECT $1, selected.category_id
                     FROM UNNEST($2::uuid[]) AS selected(category_id)`,
                    [mangaId, categoryIds],
                );
            }

            if (demographicCategoryIds.length > 0) {
                await client.query(
                    `INSERT INTO manga_demographic_category (manga_id, demographic_category_id)
                     SELECT $1, selected.demographic_category_id
                     FROM UNNEST($2::uuid[]) AS selected(demographic_category_id)`,
                    [mangaId, demographicCategoryIds],
                );
            }

            const createdManga = await client.query(
                `${mangaQuery} WHERE mangas.id = $1`,
                [mangaId],
            );
            await client.query('COMMIT');
            transactionStarted = false;

            return createdManga.rows[0];
        } catch (error) {
            if (transactionStarted) {
                await client.query('ROLLBACK');
            }
            if (error.code === '23505') {
                throw new AppError('A manga with this slug or SKU already exists', 409);
            }
            throw error;
        } finally {
            client.release();
        }
    }

    static async update(id, data) {
        const { name, slug, description, volume, author, editorial, image_link, sku, origin, release_date, price, stock } = data;
        const query = `
            UPDATE mangas 
            SET name = $1, slug = $2, description = $3, volume = $4, author = $5, editorial = $6, 
                image_link = $7, sku = $8, origin = $9, release_date = $10, price = $11, stock = $12
            WHERE id = $13
            RETURNING *;
        `;
        const values = [name, slug, description, volume, author, editorial, image_link, sku, origin, release_date, price, stock, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async delete(id) {
        const query = `DELETE FROM mangas WHERE id = $1 RETURNING id;`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
}

export default Manga;