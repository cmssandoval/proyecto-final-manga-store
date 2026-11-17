import { z } from 'zod';

const orderItemSchema = z.object({
    mangaId: z.uuid({ error: 'mangaId must be a valid UUID' }),
    quantity: z
        .number({ error: 'quantity must be a positive integer' })
        .int('quantity must be a positive integer')
        .positive('quantity must be a positive integer'),
}).strict();

const orderItemsSchema = z.array(orderItemSchema, {
    error: 'items must be an array',
}).min(1, 'At least one item is required')
    .superRefine((items, context) => {
        const mangaIds = new Set();
        items.forEach((item, index) => {
            const mangaId = item.mangaId.toLowerCase();
            if (mangaIds.has(mangaId)) {
                context.addIssue({
                    code: 'custom',
                    message: 'A manga can only appear once in items',
                    path: [index, 'mangaId'],
                });
            }
            mangaIds.add(mangaId);
        });
    });

export const orderParamsSchema = z.object({
    id: z.uuid({ error: 'Invalid params value' }),
});

export const createOrderSchema = z.object({
    shippingAddress: z.string().trim().min(1, 'shippingAddress is required'),
    notes: z.string().trim().optional(),
    items: orderItemsSchema,
}).strict();

const guestOrderSchema = z.object({
    guestOrderId: z
        .string()
        .max(50, 'guestOrderId is too long')
        .regex(/^GUEST-\d+-[a-z0-9]+$/i, 'guestOrderId must identify a guest order'),
    shippingAddress: z.string().trim().min(1, 'shippingAddress is required'),
    items: orderItemsSchema,
}).strict();

export const syncOrdersSchema = z.object({
    orders: z.array(guestOrderSchema, {
        error: 'orders must be an array',
    }).min(1, 'At least one guest order is required'),
}).strict().superRefine(({ orders }, context) => {
    const guestOrderIds = new Set();
    orders.forEach((order, index) => {
        const guestOrderId = order.guestOrderId.toLowerCase();
        if (guestOrderIds.has(guestOrderId)) {
            context.addIssue({
                code: 'custom',
                message: 'A guest order can only appear once',
                path: ['orders', index, 'guestOrderId'],
            });
        }
        guestOrderIds.add(guestOrderId);
    });
});
