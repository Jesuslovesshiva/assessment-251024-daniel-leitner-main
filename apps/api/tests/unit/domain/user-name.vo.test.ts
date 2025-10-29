import { describe, expect, it } from 'vitest';
import { UserName } from '../../../src/modules/core/domain/value-objects/user-name.vo';

describe('UserName Value Object', () => {
  describe('create', () => {
    it('should create a valid name', () => {
      const name = UserName.create('John Doe');

      expect(name.value).toBe('John Doe');
    });

    it('should trim whitespace', () => {
      const name = UserName.create('  John Doe  ');

      expect(name.value).toBe('John Doe');
    });

    it('should accept name with minimum length', () => {
      const name = UserName.create('AB');

      expect(name.value).toBe('AB');
    });

    it('should accept name with maximum length', () => {
      const longName = 'a'.repeat(100);
      const name = UserName.create(longName);

      expect(name.value).toBe(longName);
    });

    it('should throw error for empty name', () => {
      expect(() => UserName.create('')).toThrow('Name cannot be empty');
    });

    it('should throw error for whitespace-only name', () => {
      expect(() => UserName.create('   ')).toThrow('Name cannot be empty');
    });

    it('should throw error for name too short', () => {
      expect(() => UserName.create('A')).toThrow('Name must be at least 2 characters');
    });

    it('should throw error for name too long', () => {
      const tooLong = 'a'.repeat(101);
      expect(() => UserName.create(tooLong)).toThrow('Name cannot exceed 100 characters');
    });
  });

  describe('equals', () => {
    it('should return true for equal names', () => {
      const name1 = UserName.create('John Doe');
      const name2 = UserName.create('John Doe');

      expect(name1.equals(name2)).toBe(true);
    });

    it('should return false for different names', () => {
      const name1 = UserName.create('John Doe');
      const name2 = UserName.create('Jane Smith');

      expect(name1.equals(name2)).toBe(false);
    });

    it('should return false for names with different casing', () => {
      const name1 = UserName.create('John Doe');
      const name2 = UserName.create('john doe');

      expect(name1.equals(name2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return name as string', () => {
      const name = UserName.create('John Doe');

      expect(name.toString()).toBe('John Doe');
    });
  });
});
