import { z } from 'zod';

const requiredText = (field, maxLength) => z
    .string()
    .trim()
    .min(1, `${field} is required`)
    .max(maxLength, `${field} must not exceed ${maxLength} characters`);

const nonNegativeNumber = (field, integer = false) => z
    .union([
        z.number(),
        z.string().trim().min(1, `${field} is required`),
    ])
    .transform(Number)
    .pipe(
        z.number({ error: `${field} must be a valid number` })
            .nonnegative(`${field} must not be negative`)
            .refine((value) => !integer || Number.isInteger(value), `${field} must be an integer`),
    );

const uuidList = (field) => z
    .array(z.uuid({ error: `${field} must contain valid UUIDs` }))
    .default([])
    .superRefine((ids, context) => {
        const uniqueIds = new Set(ids.map((id) => id.toLowerCase()));
        if (uniqueIds.size !== ids.length) {
            context.addIssue({
                code: 'custom',
                message: `${field} must not contain duplicates`,
            });
        }
    });

export const createMangaSchema = z.strictObject({
    name: requiredText('name', 255),
    slug: z
        .string()
        .trim()
        .min(1, 'slug is required')
        .max(255, 'slug must not exceed 255 characters')
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must use lowercase letters, numbers, and hyphens'),
    description: z.string().trim().min(1, 'description is required'),
    volume: requiredText('volume', 50),
    author: requiredText('author', 150),
    editorial: requiredText('editorial', 150),
    image_link: z
        .string()
        .trim()
        .max(2048, 'image_link must not exceed 2048 characters')
        .pipe(z.url({ error: 'image_link must be a valid URL' })),
    sku: requiredText('sku', 64),
    origin: requiredText('origin', 100),
    release_date: z.iso.date({ error: 'release_date must be a valid date' }),
    price: nonNegativeNumber('price'),
    stock: nonNegativeNumber('stock', true),
    categoryIds: uuidList('categoryIds'),
    demographicCategoryIds: uuidList('demographicCategoryIds'),
});
