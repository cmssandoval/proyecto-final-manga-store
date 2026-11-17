import pool from '../database/connection.js';
import AppError from '../utils/app-error.js';

const withTransaction = async (operation) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await operation(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const findOrCreateCartId = async (client, userId) => {
    const result = await client.query(
        `INSERT INTO carts (user_id)
         VALUES ($1)
         ON CONFLICT (user_id) DO NOTHING
         RETURNING id`,
        [userId],
    );
    if (result.rows[0]) return result.rows[0].id;

    const existingCart = await client.query(
        'SELECT id FROM carts WHERE user_id = $1',
        [userId],
    );
    return existingCart.rows[0].id;
};

const addItemToCart = async (client, cartId, { mangaId, quantity }) => {
    const mangaResult = await client.query(
        'SELECT stock FROM mangas WHERE id = $1',
        [mangaId],
    );
    if (!mangaResult.rows[0]) {
        throw new AppError('Manga not found', 404);
    }

    const { stock } = mangaResult.rows[0];
    if (quantity > stock) {
        throw new AppError('Requested quantity exceeds available stock', 400);
    }

    const result = await client.query(
        `INSERT INTO cart_items (cart_id, manga_id, quantity)
         VALUES ($1, $2, $3)
         ON CONFLICT (cart_id, manga_id) DO UPDATE
         SET quantity = cart_items.quantity + EXCLUDED.quantity
         WHERE cart_items.quantity + EXCLUDED.quantity <= $4
         RETURNING id, cart_id, manga_id, quantity`,
        [cartId, mangaId, quantity, stock],
    );
    if (!result.rows[0]) {
        throw new AppError('Requested quantity exceeds available stock', 400);
    }
    await client.query(
        'UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [cartId],
    );
    return result.rows[0];
};

class Cart {
    static async findCartById(userId) {
        const cartResult = await pool.query(
            'SELECT id FROM carts WHERE user_id = $1',
            [userId],
        );
        if (!cartResult.rows[0]) {
            return { id: null, items: [] };
        }

        const cartId = cartResult.rows[0].id;
        const itemsResult = await pool.query(
            `SELECT
                cart_items.id AS cart_item_id,
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
                cart_items.quantity
             FROM cart_items
             INNER JOIN mangas ON mangas.id = cart_items.manga_id
             WHERE cart_items.cart_id = $1
             ORDER BY mangas.name`,
            [cartId],
        );
        return { id: cartId, items: itemsResult.rows };
    }

    static async addItem({ userId, mangaId, quantity }) {
        return withTransaction(async (client) => {
            const cartId = await findOrCreateCartId(client, userId);
            return addItemToCart(client, cartId, { mangaId, quantity });
        });
    }

    static async updateItem({ userId, id, quantity }) {
        return withTransaction(async (client) => {
            const itemResult = await client.query(
                `SELECT cart_items.id, mangas.stock
                 FROM cart_items
                 INNER JOIN carts ON carts.id = cart_items.cart_id
                 INNER JOIN mangas ON mangas.id = cart_items.manga_id
                 WHERE cart_items.id = $1 AND carts.user_id = $2
                 FOR UPDATE OF cart_items`,
                [id, userId],
            );
            const item = itemResult.rows[0];
            if (!item) return null;
            if (quantity > item.stock) {
                throw new AppError('Requested quantity exceeds available stock', 400);
            }

            const result = await client.query(
                `UPDATE cart_items
                 SET quantity = $1
                 WHERE id = $2
                 RETURNING id, cart_id, manga_id, quantity`,
                [quantity, id],
            );
            await client.query(
                `UPDATE carts
                 SET updated_at = CURRENT_TIMESTAMP
                 WHERE id = $1`,
                [result.rows[0].cart_id],
            );
            return result.rows[0];
        });
    }

    static async deleteItem({ userId, id }) {
        const result = await pool.query(
            `DELETE FROM cart_items
             USING carts
             WHERE cart_items.cart_id = carts.id
               AND carts.user_id = $1
               AND cart_items.id = $2
             RETURNING cart_items.id, cart_items.cart_id`,
            [userId, id],
        );
        if (result.rows[0]) {
            await pool.query(
                'UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
                [result.rows[0].cart_id],
            );
        }
        return result.rowCount > 0;
    }

    static async clearCart(userId) {
        const result = await pool.query(
            'DELETE FROM carts WHERE user_id = $1 RETURNING id',
            [userId],
        );
        return result.rowCount > 0;
    }

    static async sync({ userId, items }) {
        return withTransaction(async (client) => {
            const cartId = await findOrCreateCartId(client, userId);
            for (const item of items) {
                await addItemToCart(client, cartId, item);
            }
        });
    }
}

export default Cart;
