import { z } from 'zod';

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre es demasiado largo'),
  email: z
    .email('Ingresa un email válido')
    .trim()
    .min(1, 'El correo es obligatorio')
    .max(254, 'El email es demasiado largo')
    .toLowerCase(),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(64, 'La contraseña no debe superar los 64 caracteres')
    .regex(/[a-z]/, 'La contraseña debe incluir al menos una letra minúscula')
    .regex(/[A-Z]/, 'La contraseña debe incluir al menos una letra mayúscula')
    .regex(/\d/, 'La contraseña debe incluir al menos un número')
    .regex(/[^A-Za-z0-9]/, 'La contraseña debe incluir al menos un símbolo'),
  confirmPassword: z.string(),
})
.refine((data) => data.password === data.confirmPassword, {
  error: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export default registerSchema;