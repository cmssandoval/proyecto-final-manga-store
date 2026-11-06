import { z } from 'zod';

const LoginSchema = z.object({
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
});

export default LoginSchema;