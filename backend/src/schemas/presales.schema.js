import { z } from 'zod';

const presaleItemSchema = z.object({
    mangaId: z.uuid({ error: 'mangaId must be a valid UUID' }),
    quantity: z
        .number({ error: 'quantity must be a positive integer' })
        .int('quantity must be a positive integer')
        .positive('quantity must be a positive integer'),
}).strict();

const presaleItemsSchema = z.array(presaleItemSchema, {
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

export const presaleParamsSchema = z.object({
    id: z.uuid({ error: 'Invalid params value' }),
});

export const createPresaleSchema = z.object({
    items: presaleItemsSchema,
}).strict();
