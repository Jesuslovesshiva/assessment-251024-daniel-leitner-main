import { describe, expect, it } from 'vitest';
import { User } from '../../../src/modules/core/domain/entities/user.entity';
import { UserValidationError } from '../../../src/modules/core/domain/errors';

describe('User Entity', () => {
  const validId = '550e8400-e29b-41d4-a716-446655440000';
  const validName = 'John Doe';
  const validEmail = 'john@example.com';

  describe('create', () => {
    it('should create a new user', () => {
      const user = User.create(validId, validName, validEmail);

      expect(user.id).toBe(validId);
      expect(user.getNameAsString()).toBe(validName);
      expect(user.getEmailAsString()).toBe(validEmail);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
      expect(user.createdAt.getTime()).toBe(user.updatedAt.getTime());
    });

    it('should normalize email to lowercase', () => {
      const user = User.create(validId, validName, 'JOHN@EXAMPLE.COM');

      expect(user.getEmailAsString()).toBe('john@example.com');
    });

    it('should throw error for invalid UUID', () => {
      expect(() => User.create('invalid-uuid', validName, validEmail)).toThrow(UserValidationError);
    });

    it('should throw error for empty id', () => {
      expect(() => User.create('', validName, validEmail)).toThrow(UserValidationError);
    });

    it('should throw error for invalid name', () => {
      expect(() => User.create(validId, 'A', validEmail)).toThrow('Name must be at least');
    });

    it('should throw error for invalid email', () => {
      expect(() => User.create(validId, validName, 'invalid-email')).toThrow(
        'Invalid email format',
      );
    });
  });

  describe('fromPersistence', () => {
    it('should reconstitute user from persistence data', () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');

      const user = User.fromPersistence({
        id: validId,
        name: validName,
        email: validEmail,
        createdAt,
        updatedAt,
      });

      expect(user.id).toBe(validId);
      expect(user.getNameAsString()).toBe(validName);
      expect(user.getEmailAsString()).toBe(validEmail);
      expect(user.createdAt).toBe(createdAt);
      expect(user.updatedAt).toBe(updatedAt);
    });

    it('should validate dates on reconstitution', () => {
      const createdAt = new Date('2024-01-02');
      const updatedAt = new Date('2024-01-01');

      expect(() =>
        User.fromPersistence({
          id: validId,
          name: validName,
          email: validEmail,
          createdAt,
          updatedAt,
        }),
      ).toThrow('Created date cannot be after updated date');
    });
  });

  describe('updateName', () => {
    it('should return new user with updated name', () => {
      const user = User.create(validId, validName, validEmail);
      const updated = user.updateName('Jane Smith');

      expect(updated.getNameAsString()).toBe('Jane Smith');
      expect(updated.getEmailAsString()).toBe(validEmail);
      expect(updated.id).toBe(user.id);
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(user.updatedAt.getTime());
    });

    it('should not mutate original user', () => {
      const user = User.create(validId, validName, validEmail);
      const originalName = user.getNameAsString();
      user.updateName('Jane Smith');

      expect(user.getNameAsString()).toBe(originalName);
    });
  });

  describe('updateEmail', () => {
    it('should return new user with updated email', () => {
      const user = User.create(validId, validName, validEmail);
      const updated = user.updateEmail('jane@example.com');

      expect(updated.getEmailAsString()).toBe('jane@example.com');
      expect(updated.getNameAsString()).toBe(validName);
      expect(updated.id).toBe(user.id);
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(user.updatedAt.getTime());
    });

    it('should not mutate original user', () => {
      const user = User.create(validId, validName, validEmail);
      const originalEmail = user.getEmailAsString();
      user.updateEmail('jane@example.com');

      expect(user.getEmailAsString()).toBe(originalEmail);
    });
  });

  describe('update', () => {
    it('should update both name and email', () => {
      const user = User.create(validId, validName, validEmail);
      const updated = user.update({
        name: 'Jane Smith',
        email: 'jane@example.com',
      });

      expect(updated.getNameAsString()).toBe('Jane Smith');
      expect(updated.getEmailAsString()).toBe('jane@example.com');
    });

    it('should update only name', () => {
      const user = User.create(validId, validName, validEmail);
      const updated = user.update({ name: 'Jane Smith' });

      expect(updated.getNameAsString()).toBe('Jane Smith');
      expect(updated.getEmailAsString()).toBe(validEmail);
    });

    it('should update only email', () => {
      const user = User.create(validId, validName, validEmail);
      const updated = user.update({ email: 'jane@example.com' });

      expect(updated.getNameAsString()).toBe(validName);
      expect(updated.getEmailAsString()).toBe('jane@example.com');
    });

    it('should return same values when no changes', () => {
      const user = User.create(validId, validName, validEmail);
      const updated = user.update({});

      expect(updated.getNameAsString()).toBe(validName);
      expect(updated.getEmailAsString()).toBe(validEmail);
    });
  });

  describe('equals', () => {
    it('should return true for users with same ID', () => {
      const user1 = User.create(validId, validName, validEmail);
      const user2 = User.create(validId, 'Different Name', 'different@example.com');

      expect(user1.equals(user2)).toBe(true);
    });

    it('should return false for users with different IDs', () => {
      const user1 = User.create(validId, validName, validEmail);
      const user2 = User.create('550e8400-e29b-41d4-a716-446655440001', validName, validEmail);

      expect(user1.equals(user2)).toBe(false);
    });
  });
});
