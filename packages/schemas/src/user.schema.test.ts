import { describe, it, expect } from 'vitest';
import { CreateUserSchema, UpdateUserSchema, UserSchema } from './user.schema';

describe('User Schemas', () => {
  describe('CreateUserSchema', () => {
    it('should validate a valid user creation payload', () => {
      const validUser = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const result = CreateUserSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it('should reject empty name', () => {
      const invalidUser = {
        name: '',
        email: 'john@example.com',
      };

      const result = CreateUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should reject invalid email', () => {
      const invalidUser = {
        name: 'John Doe',
        email: 'not-an-email',
      };

      const result = CreateUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should reject name longer than 100 characters', () => {
      const invalidUser = {
        name: 'a'.repeat(101),
        email: 'john@example.com',
      };

      const result = CreateUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });
  });

  describe('UpdateUserSchema', () => {
    it('should validate partial updates', () => {
      const validUpdate = {
        name: 'Jane Doe',
      };

      const result = UpdateUserSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it('should validate email-only updates', () => {
      const validUpdate = {
        email: 'jane@example.com',
      };

      const result = UpdateUserSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it('should accept empty object', () => {
      const result = UpdateUserSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('UserSchema', () => {
    it('should validate a complete user object', () => {
      const user = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = UserSchema.safeParse(user);
      expect(result.success).toBe(true);
    });

    it('should reject invalid UUID', () => {
      const user = {
        id: 'not-a-uuid',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = UserSchema.safeParse(user);
      expect(result.success).toBe(false);
    });
  });
});
