import { z } from 'zod';

const emailSchema = z
    .email('Ingresa un email válido')
    .trim()
    .min(1, 'El correo es obligatorio')
    .max(254, 'El email es demasiado largo')
    .toLowerCase();

const loginPasswordSchema = z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(64, 'La contraseña no debe superar los 64 caracteres');

const registerPasswordSchema = loginPasswordSchema
    .regex(/[a-z]/, 'La contraseña debe incluir al menos una letra minúscula')
    .regex(/[A-Z]/, 'La contraseña debe incluir al menos una letra mayúscula')
    .regex(/\d/, 'La contraseña debe incluir al menos un número')
    .regex(/[^A-Za-z0-9]/, 'La contraseña debe incluir al menos un símbolo');

const fullNameSchema = z
    .string()
    .trim()
    .min(1, 'El nombre completo es obligatorio')
    .max(50, 'El nombre completo no debe superar los 50 caracteres');

const displayNameSchema = z
    .string()
    .trim()
    .min(1, 'El nombre visible es obligatorio')
    .max(50, 'El nombre visible no debe superar los 50 caracteres');

export const loginUserSchema = z.object({
    email: emailSchema,
    password: loginPasswordSchema,
});

export const registerUserSchema = z.strictObject({
    full_name: fullNameSchema,
    display_name: displayNameSchema,
    email: emailSchema,
    password: registerPasswordSchema,
});
