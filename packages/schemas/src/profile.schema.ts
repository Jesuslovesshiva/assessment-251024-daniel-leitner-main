import { z } from 'zod';

const BioSchema = z
  .string()
  .max(1000, 'Bio cannot exceed 1000 characters');

const PositionSchema = z
  .string()
  .min(2, 'Position must be at least 2 characters')
  .max(100, 'Position cannot exceed 100 characters')
  .trim();

const DepartmentSchema = z
  .string()
  .min(2, 'Department must be at least 2 characters')
  .max(100, 'Department cannot exceed 100 characters')
  .trim();

const LinkedInSchema = z
  .string()
  .trim()
  .url('LinkedIn URL must be a valid URL')
  .max(255, 'LinkedIn URL cannot exceed 255 characters');

export const ProfileSchema = z.object({
  id: z.string().uuid('ID must be a valid UUID'),
  userId: z.string().uuid('User ID must be a valid UUID'),
  bio: BioSchema,
  position: PositionSchema,
  department: DepartmentSchema,
  linkedinUrl: LinkedInSchema.nullable().optional(),
  gravatarUrl: z.string().url('Gravatar URL must be a valid URL'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UpdateProfileSchema = z.object({
  bio: BioSchema.optional(),
  position: PositionSchema.optional(),
  department: DepartmentSchema.optional(),
  linkedinUrl: LinkedInSchema.nullable().optional(),
});

export const ProfileResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  bio: z.string(),
  position: z.string(),
  department: z.string(),
  linkedinUrl: z.string().url().nullable().optional(),
  gravatarUrl: z.string().url(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Profile = z.infer<typeof ProfileSchema>;
export type ProfileResponse = z.infer<typeof ProfileResponseSchema>;
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;

