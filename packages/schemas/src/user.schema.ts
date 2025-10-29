import { z } from 'zod';
import { ProfileResponseSchema } from './profile.schema';

const NameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name cannot exceed 100 characters')
  .trim()
  .refine((val) => val.length > 0, {
    message: 'Name cannot be empty or only whitespace',
  });

const EmailSchema = z.string().email('Email must be a valid email address').toLowerCase().trim();

export const UserSchema = z.object({
  id: z.string().uuid('ID must be a valid UUID'),
  name: NameSchema,
  email: EmailSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateUserSchema = z.object({
  name: NameSchema,
  email: EmailSchema,
});

export const UpdateUserSchema = z.object({
  name: NameSchema.optional(),
  email: EmailSchema.optional(),
});

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export const UserResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  profile: ProfileResponseSchema.nullable().optional(),
});

export type UserResponse = z.infer<typeof UserResponseSchema>;
