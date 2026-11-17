import { z } from 'zod';

const mangaIdSchema = z.uuid({ error: 'mangaId must be a valid UUID' });
const quantitySchema = z
    .number({ error: 'quantity must be a positive integer' })
    .int('quantity must be a positive integer')
    .positive('quantity must be a positive integer');

export const addCartItemSchema = z.object({
    mangaId: mangaIdSchema,
    quantity: quantitySchema.default(1),
});

export const cartItemParamsSchema = z.object({
    id: z.uuid({ error: 'Invalid params value' }),
});

export const updateCartItemBodySchema = z.object({
    quantity: quantitySchema,
});

export const syncCartBodySchema = z.object({
    items: z.array(
        z.object({
            mangaId: mangaIdSchema,
            quantity: quantitySchema,
        }),
        { error: 'items must be an array' },
    ),
});
