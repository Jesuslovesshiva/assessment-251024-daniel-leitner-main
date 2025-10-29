import { NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { UserService } from '../../src/modules/core/application/services/user.service';
import { IntegrationTestHelper } from '../helpers/integration-test.helper';

describe('UserService', () => {
  let helper: IntegrationTestHelper;
  let service: UserService;
  let prisma: PrismaClient;

  beforeAll(async () => {
    helper = await IntegrationTestHelper.create();
    service = helper.getService(UserService);
    prisma = helper.getPrisma();
  });

  afterAll(async () => {
    await helper.close();
  });

  beforeEach(async () => {
    await helper.startNewTransaction();
  });

  afterEach(() => {
    helper.rollbackCurrentTransaction();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createDto = {
        name: 'Test User',
        email: 'test@example.com',
      };

      const user = await service.create(createDto);

      expect(user).toBeDefined();
      expect(user.getNameAsString()).toBe(createDto.name);
      expect(user.getEmailAsString()).toBe(createDto.email);
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('should convert email to lowercase', async () => {
      const user = await service.create({
        name: 'Test User',
        email: 'TEST@EXAMPLE.COM',
      });

      expect(user.getEmailAsString()).toBe('test@example.com');
    });

    it('should throw NotFoundException when email already exists', async () => {
      await prisma.user.create({
        data: {
          name: 'Existing User',
          email: 'existing@example.com',
        },
      });

      await expect(
        service.create({
          name: 'New User',
          email: 'existing@example.com',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const now = new Date();
      const earlier = new Date(now.getTime() - 1000);

      await prisma.user.create({
        data: {
          name: 'User 1',
          email: 'user1@example.com',
          createdAt: earlier,
          updatedAt: earlier,
        },
      });

      await prisma.user.create({
        data: {
          name: 'User 2',
          email: 'user2@example.com',
          createdAt: now,
          updatedAt: now,
        },
      });

      const users = await service.findAll();

      expect(users).toHaveLength(2);
      expect(users[0].getNameAsString()).toBe('User 2');
      expect(users[1].getNameAsString()).toBe('User 1');
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const created = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
        },
      });

      const user = await service.findOne(created.id);

      expect(user).toBeDefined();
      expect(user.id).toBe(created.id);
      expect(user.getNameAsString()).toBe('Test User');
    });

    it('should throw NotFoundException if user not found', async () => {
      await expect(service.findOne('550e8400-e29b-41d4-a716-446655440000')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const created = await prisma.user.create({
        data: {
          name: 'Original Name',
          email: 'original@example.com',
        },
      });

      const updated = await service.update(created.id, {
        name: 'Updated Name',
      });

      expect(updated.getNameAsString()).toBe('Updated Name');
      expect(updated.getEmailAsString()).toBe('original@example.com');
    });

    it('should throw NotFoundException if user not found', async () => {
      await expect(
        service.update('550e8400-e29b-41d4-a716-446655440000', { name: 'New Name' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when updating to existing email', async () => {
      const user1 = await prisma.user.create({
        data: {
          name: 'User 1',
          email: 'user1@example.com',
        },
      });

      await prisma.user.create({
        data: {
          name: 'User 2',
          email: 'user2@example.com',
        },
      });

      await expect(service.update(user1.id, { email: 'user2@example.com' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const created = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
        },
      });

      await service.remove(created.id);

      const user = await prisma.user.findUnique({ where: { id: created.id } });
      expect(user).toBeNull();
    });

    it('should throw NotFoundException if user not found', async () => {
      await expect(service.remove('550e8400-e29b-41d4-a716-446655440000')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
