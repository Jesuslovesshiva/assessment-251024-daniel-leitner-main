import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { PrismaClient } from '@prisma/client';
import { E2ETestHelper } from '../helpers/e2e-test.helper';

describe('UserController (E2E)', () => {
  let helper: E2ETestHelper;
  let app: NestFastifyApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    helper = await E2ETestHelper.create();
    app = helper.getApp();
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

  describe('POST /api/users', () => {
    it('should create a new user with profile', async () => {
      const createDto = {
        name: 'Test User',
        email: 'test@example.com',
      };

      const response = await app.inject({
        method: 'POST',
        url: '/api/users',
        payload: createDto,
      });

      expect(response.statusCode).toBe(201);
      const body = response.json();
      expect(body.name).toBe(createDto.name);
      expect(body.email).toBe(createDto.email);
      expect(body.id).toBeDefined();
      expect(body.profile).toBeDefined();
      expect(body.profile.bio).toBeDefined();

      const dbUser = await prisma.user.findUnique({ where: { id: body.id } });
      expect(dbUser).toBeDefined();
      expect(dbUser?.name).toBe(createDto.name);

      const dbProfile = await prisma.profile.findUnique({ where: { userId: body.id } });
      expect(dbProfile).toBeDefined();
    });

    it('should convert email to lowercase', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/users',
        payload: {
          name: 'Test User',
          email: 'TEST@EXAMPLE.COM',
        },
      });

      expect(response.statusCode).toBe(201);
      const body = response.json();
      expect(body.email).toBe('test@example.com');
    });

    it('should return 404 when creating user with duplicate email', async () => {
      await prisma.user.create({
        data: {
          name: 'Existing User',
          email: 'existing@example.com',
        },
      });

      const response = await app.inject({
        method: 'POST',
        url: '/api/users',
        payload: {
          name: 'New User',
          email: 'existing@example.com',
        },
      });

      expect(response.statusCode).toBe(404);
    });

    it('should return 400 for invalid email', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/users',
        payload: {
          name: 'Test User',
          email: 'invalid-email',
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should return 400 for name too short', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/users',
        payload: {
          name: 'A',
          email: 'test@example.com',
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/users', () => {
    it('should return all users with profiles', async () => {
      await prisma.user.createMany({
        data: [
          { name: 'User 1', email: 'user1@example.com' },
          { name: 'User 2', email: 'user2@example.com' },
        ],
      });

      const response = await app.inject({
        method: 'GET',
        url: '/api/users',
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body).toHaveLength(2);
      body.forEach((user: any) => {
        expect(user.profile).toBeDefined();
        expect(user.profile.position).toBeDefined();
      });
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by id with profile', async () => {
      const user = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
        },
      });

      const response = await app.inject({
        method: 'GET',
        url: `/api/users/${user.id}`,
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.id).toBe(user.id);
      expect(body.name).toBe(user.name);
      expect(body.profile).toBeDefined();
    });

    it('should return 404 for non-existent user', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/users/550e8400-e29b-41d4-a716-446655440000',
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('PATCH /api/users/:id', () => {
    it('should update a user and preserve profile', async () => {
      const user = await prisma.user.create({
        data: {
          name: 'Original Name',
          email: 'original@example.com',
        },
      });

      const response = await app.inject({
        method: 'PATCH',
        url: `/api/users/${user.id}`,
        payload: {
          name: 'Updated Name',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.name).toBe('Updated Name');
      expect(body.email).toBe('original@example.com');
      expect(body.profile).toBeDefined();

      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      expect(dbUser?.name).toBe('Updated Name');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user', async () => {
      const user = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
        },
      });

      const response = await app.inject({
        method: 'DELETE',
        url: `/api/users/${user.id}`,
      });

      expect(response.statusCode).toBe(204);

      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      expect(dbUser).toBeNull();
    });
  });

  describe('Profile endpoints', () => {
    it('should retrieve a user profile', async () => {
      const user = await prisma.user.create({
        data: {
          name: 'Profile User',
          email: 'profile@example.com',
        },
      });

      const response = await app.inject({
        method: 'GET',
        url: `/api/users/${user.id}/profile`,
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.userId).toBe(user.id);
      expect(body.gravatarUrl).toContain('gravatar');
    });

    it('should update a user profile', async () => {
      const user = await prisma.user.create({
        data: {
          name: 'Profile Update User',
          email: 'profile-update@example.com',
        },
      });

      const response = await app.inject({
        method: 'PATCH',
        url: `/api/users/${user.id}/profile`,
        payload: {
          bio: 'Updated bio',
          position: 'Tech Lead',
          department: 'Engineering',
          linkedinUrl: 'https://www.linkedin.com/in/profile-update',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.bio).toBe('Updated bio');
      expect(body.position).toBe('Tech Lead');
      expect(body.linkedinUrl).toBe('https://www.linkedin.com/in/profile-update');

      const dbProfile = await prisma.profile.findUnique({ where: { userId: user.id } });
      expect(dbProfile?.bio).toBe('Updated bio');
    });
  });
});
