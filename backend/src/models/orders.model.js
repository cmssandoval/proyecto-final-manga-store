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

const orderSelect = `
    SELECT
        purchase_orders.id,
        purchase_orders.order_number AS "orderNumber",
        purchase_orders.status,
        purchase_orders.currency,
        purchase_orders.net_amount AS "netAmount",
        purchase_orders.tax_amount AS "taxAmount",
        purchase_orders.total_amount AS total,
        purchase_orders.shipping_address AS "shippingAddress",
        purchase_orders.notes,
        purchase_orders.created_at AS "createdAt",
        purchase_orders.updated_at AS "updatedAt",
        COALESCE(
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id', purchase_order_items.id,
                    'mangaId', purchase_order_items.manga_id,
                    'sku', purchase_order_items.sku,
                    'name', purchase_order_items.description,
                    'description', purchase_order_items.description,
                    'quantity', purchase_order_items.quantity,
                    'price', purchase_order_items.unit_price,
                    'taxRate', purchase_order_items.tax_rate,
                    'subtotal', purchase_order_items.subtotal,
                    'image', mangas.image_link
                )
                ORDER BY purchase_order_items.created_at, purchase_order_items.id
            ) FILTER (WHERE purchase_order_items.id IS NOT NULL),
            '[]'::JSON
        ) AS items
    FROM purchase_orders
    LEFT JOIN purchase_order_items
        ON purchase_order_items.purchase_order_id = purchase_orders.id
    LEFT JOIN mangas ON mangas.id = purchase_order_items.manga_id
`;

const createOrderWithClient = async (client, {
    userId,
    orderNumber,
    shippingAddress,
    notes,
    items,
    clearCart = false,
}) => {
    const orderResult = await client.query(
        `INSERT INTO purchase_orders (
            order_number, buyer_id, status, currency, net_amount,
            tax_amount, total_amount, shipping_address, notes
         )
         VALUES (
            COALESCE($1::VARCHAR, 'PO-' || gen_random_uuid()::TEXT),
            $2, 'pendiente', 'CLP', 0, 0, 0, $3, $4
         )
         ON CONFLICT (order_number) DO NOTHING
         RETURNING id`,
        [orderNumber || null, userId, shippingAddress, notes || null],
    );

    if (!orderResult.rows[0]) {
        if (!orderNumber) {
            throw new AppError('Order number already exists', 409);
        }

        const existingOrderResult = await client.query(
            'SELECT id, buyer_id FROM purchase_orders WHERE order_number = $1',
            [orderNumber],
        );
        const existingOrder = existingOrderResult.rows[0];
        if (!existingOrder || existingOrder.buyer_id.toLowerCase() !== userId.toLowerCase()) {
            throw new AppError('Guest order is already associated with another account', 409);
        }

        return existingOrder.id;
    }

    const orderId = orderResult.rows[0].id;
    const mangaIds = items.map((item) => item.mangaId);
    const mangasResult = await client.query(
        `SELECT id, sku, name, volume, price, stock
         FROM mangas
         WHERE id = ANY($1::UUID[])
         ORDER BY id
         FOR UPDATE`,
        [mangaIds],
    );
    const mangasById = new Map(
        mangasResult.rows.map((manga) => [manga.id.toLowerCase(), manga]),
    );

    for (const item of items) {
        const manga = mangasById.get(item.mangaId.toLowerCase());
        if (!manga) throw new AppError('Manga not found', 404);
        if (item.quantity > manga.stock) {
            throw new AppError('Requested quantity exceeds available stock', 409);
        }
    }

    for (const item of items) {
        const manga = mangasById.get(item.mangaId.toLowerCase());
        const stockResult = await client.query(
            `UPDATE mangas
             SET stock = stock - $1
             WHERE id = $2 AND stock >= $1
             RETURNING id`,
            [item.quantity, manga.id],
        );
        if (!stockResult.rows[0]) {
            throw new AppError('Requested quantity exceeds available stock', 409);
        }

        await client.query(
            `INSERT INTO purchase_order_items (
                purchase_order_id, manga_id, sku, description, quantity,
                unit_price, tax_rate, subtotal
             )
             VALUES (
                $1, $2, $3, $4, $5::INTEGER, $6::NUMERIC,
                19.00, $5::INTEGER * $6::NUMERIC
             )`,
            [
                orderId,
                manga.id,
                manga.sku,
                `${manga.name} - ${manga.volume}`,
                item.quantity,
                manga.price,
            ],
        );
    }

    await client.query(
        `UPDATE purchase_orders
         SET
            net_amount = totals.net_amount,
            tax_amount = totals.tax_amount,
            total_amount = totals.net_amount + totals.tax_amount
         FROM (
            SELECT
                COALESCE(SUM(subtotal), 0)::NUMERIC(12, 2) AS net_amount,
                COALESCE(SUM(ROUND(subtotal * tax_rate / 100, 2)), 0)::NUMERIC(12, 2) AS tax_amount
            FROM purchase_order_items
            WHERE purchase_order_id = $1
         ) AS totals
         WHERE purchase_orders.id = $1`,
        [orderId],
    );

    if (clearCart) {
        await client.query(
            'DELETE FROM carts WHERE user_id = $1',
            [userId],
        );
    }

    return orderId;
};

class Orders {
    static async findAllByUserId(userId) {
        const result = await pool.query(
            `${orderSelect}
             WHERE purchase_orders.buyer_id = $1
             GROUP BY purchase_orders.id
             ORDER BY purchase_orders.created_at DESC`,
            [userId],
        );
        return result.rows;
    }

    static async findById(id, userId) {
        const result = await pool.query(
            `${orderSelect}
             WHERE purchase_orders.buyer_id = $1
               AND purchase_orders.id = $2
             GROUP BY purchase_orders.id`,
            [userId, id],
        );
        return result.rows[0];
    }

    static async create({ userId, shippingAddress, notes, items }) {
        return withTransaction((client) => createOrderWithClient(client, {
            userId,
            shippingAddress,
            notes,
            items,
            clearCart: true,
        }));
    }

    static async sync({ userId, orders }) {
        return withTransaction(async (client) => {
            const sortedOrders = [...orders].sort(
                (first, second) => first.guestOrderId.localeCompare(second.guestOrderId),
            );

            for (const order of sortedOrders) {
                await createOrderWithClient(client, {
                    userId,
                    orderNumber: order.guestOrderId,
                    shippingAddress: order.shippingAddress,
                    items: order.items,
                });
            }
        });
    }
}

export default Orders;
