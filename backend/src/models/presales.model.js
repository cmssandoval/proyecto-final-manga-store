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

const presaleSelect = `
    SELECT
        presales.id,
        presales.presale_number AS "presaleNumber",
        presales.status,
        presales.currency,
        presales.total_amount AS total,
        presales.expires_at AS "expiresAt",
        presales.converted_order_id AS "convertedOrderId",
        presales.created_at AS "createdAt",
        presales.updated_at AS "updatedAt",
        COALESCE(
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id', presales_items.id,
                    'mangaId', presales_items.manga_id,
                    'sku', presales_items.sku,
                    'name', presales_items.description,
                    'description', presales_items.description,
                    'quantity', presales_items.quantity,
                    'price', presales_items.unit_price,
                    'subtotal', presales_items.subtotal,
                    'image', mangas.image_link
                )
                ORDER BY presales_items.created_at, presales_items.id
            ) FILTER (WHERE presales_items.id IS NOT NULL),
            '[]'::JSON
        ) AS items
    FROM presales
    LEFT JOIN presales_items ON presales_items.presale_id = presales.id
    LEFT JOIN mangas ON mangas.id = presales_items.manga_id
`;

class Presales {
    static async findAllByUserId(userId) {
        const result = await pool.query(
            `${presaleSelect}
             WHERE presales.customer_id = $1
             GROUP BY presales.id
             ORDER BY presales.created_at DESC`,
            [userId],
        );
        return result.rows;
    }

    static async findById(id, userId) {
        const result = await pool.query(
            `${presaleSelect}
             WHERE presales.customer_id = $1
               AND presales.id = $2
             GROUP BY presales.id`,
            [userId, id],
        );
        return result.rows[0];
    }

    static async create({ userId, items }) {
        return withTransaction(async (client) => {
            const mangaIds = items.map((item) => item.mangaId);
            const mangasResult = await client.query(
                `SELECT
                    id, sku, name, volume, price,
                    release_date > CURRENT_DATE AS is_presale_eligible
                 FROM mangas
                 WHERE id = ANY($1::UUID[])
                 ORDER BY id
                 FOR SHARE`,
                [mangaIds],
            );
            const mangasById = new Map(
                mangasResult.rows.map((manga) => [manga.id.toLowerCase(), manga]),
            );

            for (const item of items) {
                const manga = mangasById.get(item.mangaId.toLowerCase());
                if (!manga) throw new AppError('Manga not found', 404);
                if (!manga.is_presale_eligible) {
                    throw new AppError('Manga is not available for presale', 409);
                }
            }

            const presaleResult = await client.query(
                `INSERT INTO presales (
                    presale_number, customer_id, status, currency, total_amount, expires_at
                 )
                 VALUES (
                    'PRE-' || gen_random_uuid()::TEXT,
                    $1, 'pendiente', 'CLP', 0, CURRENT_TIMESTAMP + INTERVAL '30 days'
                 )
                 RETURNING id`,
                [userId],
            );
            const presaleId = presaleResult.rows[0].id;

            for (const item of items) {
                const manga = mangasById.get(item.mangaId.toLowerCase());
                await client.query(
                    `INSERT INTO presales_items (
                        presale_id, manga_id, sku, description, quantity,
                        unit_price, subtotal
                     )
                     VALUES (
                        $1, $2, $3, $4, $5::INTEGER, $6::NUMERIC,
                        $5::INTEGER * $6::NUMERIC
                     )`,
                    [
                        presaleId,
                        manga.id,
                        manga.sku,
                        `${manga.name} - ${manga.volume}`,
                        item.quantity,
                        manga.price,
                    ],
                );
            }

            await client.query(
                `UPDATE presales
                 SET total_amount = (
                    SELECT COALESCE(SUM(subtotal), 0)::NUMERIC(12, 2)
                    FROM presales_items
                    WHERE presale_id = $1
                 )
                 WHERE id = $1`,
                [presaleId],
            );

            return presaleId;
        });
    }
}

export default Presales;
