import { z } from 'zod';

export const loginSchema = z.object({
  whatsapp: z.string().min(8, 'Ingresá tu número de WhatsApp'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  whatsapp: z.string().min(8, 'Ingresá un número de WhatsApp válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  province: z.string().min(1, 'Seleccioná tu provincia'),
  locality: z.string().optional(),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
