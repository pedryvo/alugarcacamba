import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const dumpsterSchema = z.object({
  serialNumber: z.string().min(1, 'Serial number is required'),
  color: z.string().min(1, 'Color is required'),
});

export const rentalSchema = z.object({
  dumpsterId: z.number(),
  cep: z.string().min(8, 'Invalid CEP').regex(/^\d{5}-?\d{3}$/, 'Invalid format'),
  street: z.string().min(1, 'Street is required'),
  neighborhood: z.string().min(1, 'Neighborhood is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required').max(2),
});
