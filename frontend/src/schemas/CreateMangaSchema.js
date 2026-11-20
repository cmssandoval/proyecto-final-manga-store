import { z } from 'zod';

const requiredText = (label, maxLength) => z
  .string()
  .trim()
  .min(1, `${label} es obligatorio`)
  .max(maxLength, `${label} no debe superar los ${maxLength} caracteres`);

const nonNegativeNumber = (label, integer = false) => z
  .string()
  .trim()
  .min(1, `${label} es obligatorio`)
  .transform(Number)
  .pipe(
    z.number({ error: `${label} debe ser un número válido` })
      .nonnegative(`${label} no puede ser negativo`)
      .refine((value) => !integer || Number.isInteger(value), `${label} debe ser un número entero`),
  );

const createMangaSchema = z.object({
  name: requiredText('El nombre', 255),
  slug: z
    .string()
    .trim()
    .min(1, 'El slug es obligatorio')
    .max(255, 'El slug no debe superar los 255 caracteres')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Usa minúsculas, números y guiones en el slug'),
  description: requiredText('La descripción', 5000),
  volume: requiredText('El volumen', 50),
  author: requiredText('El autor', 150),
  editorial: requiredText('La editorial', 150),
  image_link: z
    .string()
    .trim()
    .max(2048, 'La URL no debe superar los 2048 caracteres')
    .pipe(z.url({ error: 'Ingresa una URL de imagen válida' })),
  sku: requiredText('El SKU', 64),
  origin: requiredText('El origen', 100),
  release_date: z
    .string()
    .min(1, 'La fecha de lanzamiento es obligatoria')
    .refine((value) => !Number.isNaN(Date.parse(value)), 'Ingresa una fecha válida'),
  price: nonNegativeNumber('El precio'),
  stock: nonNegativeNumber('El stock', true),
  categoryIds: z.array(z.uuid()),
  demographicCategoryIds: z.array(z.uuid()),
});

export default createMangaSchema;
