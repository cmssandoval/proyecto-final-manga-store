import pool from '../database/connection.js';

// Consulta base para devolver cada manga junto con sus categorías y demografías.
// Las subconsultas evitan duplicar el manga cuando tiene varias categorías.
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
    // Devuelve todos los mangas ordenados por nombre.
    static async findAll() {
        const result = await pool.query(`${mangaQuery} ORDER BY mangas.name`);
        return result.rows;
    }

    // Busca por UUID; $1 mantiene el valor separado del SQL.
    static async findById(id) {
        const result = await pool.query(`${mangaQuery} WHERE mangas.id = $1`, [id]);
        return result.rows[0];
    }

    // Inserta los campos recibidos y devuelve la fila creada.
    static async create(data) {
        const { id, name, slug, description, volume, author, editorial, image_link, sku, origin, release_date, price, stock } = data;
        const query = `
            INSERT INTO mangas (id, name, slug, description, volume, author, editorial, image_link, sku, origin, release_date, price, stock)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING *;
        `;
        const values = [id, name, slug, description, volume, author, editorial, image_link, sku, origin, release_date, price, stock];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    // Actualiza el manga identificado por id y devuelve la fila actualizada.
    static async update(id, data) {
        const { name, slug, description, volume, author, editorial, image_link, sku, origin, release_date, price, stock } = data;
        const query = `
            UPDATE mangas 
            SET name = $1, slug = $2, description = $3, volume = $4, author = $5, editorial = $6, 
                image_link = $7, sku = $8, origin = $9, release_date = $10, price = $11, stock = $12, updated_at = NOW()
            WHERE id = $13
            RETURNING *;
        `;
        const values = [name, slug, description, volume, author, editorial, image_link, sku, origin, release_date, price, stock, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    // Elimina por UUID; devuelve el id eliminado o undefined si no existía.
    static async delete(id) {
        const query = `DELETE FROM mangas WHERE id = $1 RETURNING id;`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
}

export default Manga;