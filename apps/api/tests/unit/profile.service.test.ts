import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProfileService } from '../../src/modules/core/application/services/profile.service';
import { Profile } from '../../src/modules/core/domain/entities/profile.entity';
import { User } from '../../src/modules/core/domain/entities/user.entity';

const createUser = (id: string, email: string): User =>
  User.fromPersistence({
    id,
    name: 'Test User',
    email,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  });

const createProfile = (userId: string): Profile =>
  Profile.fromPersistence({
    id: 'b0a7b585-3f20-4f5a-8614-6a0d026d9b54',
    userId,
    bio: 'Initial bio',
    position: 'Engineer',
    department: 'Engineering',
    linkedinUrl: 'https://www.linkedin.com/in/test',
    gravatarUrl: 'https://www.gravatar.com/avatar/initial?d=identicon',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  });

describe('ProfileService', () => {
  const userId = '7a6a7304-1c8b-4a71-93a2-6c0a7e0e7c03';
  const email = 'test@example.com';

  const mockProfileRepository = {
    findByUserId: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  };

  const mockUserRepository = {
    findById: vi.fn(),
    findAll: vi.fn(),
    findByEmail: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
    existsByEmail: vi.fn(),
  };

  let service: ProfileService;

  beforeEach(() => {
    vi.restoreAllMocks();
    mockProfileRepository.findByUserId.mockReset();
    mockProfileRepository.create.mockReset();
    mockProfileRepository.update.mockReset();
    mockUserRepository.findById.mockReset();

    service = new ProfileService(
      mockProfileRepository as any,
      mockUserRepository as any,
    );

    mockUserRepository.findById.mockResolvedValue(createUser(userId, email));
  });

  it('returns existing profile', async () => {
    const existingProfile = createProfile(userId);
    mockProfileRepository.findByUserId.mockResolvedValue(existingProfile);

    const result = await service.getByUserId(userId);

    expect(result).toBe(existingProfile);
    expect(mockProfileRepository.create).not.toHaveBeenCalled();
  });

  it('creates default profile when missing', async () => {
    mockProfileRepository.findByUserId.mockResolvedValue(null);
    mockProfileRepository.create.mockImplementation(async (profile: Profile) => profile);

    const result = await service.getByUserId(userId);

    expect(result).toBeDefined();
    expect(mockProfileRepository.create).toHaveBeenCalled();
  });

  it('updates profile fields', async () => {
    const existingProfile = createProfile(userId);
    mockProfileRepository.findByUserId.mockResolvedValue(existingProfile);
    mockProfileRepository.update.mockImplementation(async (profile: Profile) => profile);

    const result = await service.update(userId, {
      bio: 'Updated bio',
      position: 'Tech Lead',
      department: 'Product',
      linkedinUrl: null,
    });

    expect(result.bio).toBe('Updated bio');
    expect(result.department).toBe('Product');
    expect(result.linkedinUrl).toBeNull();
    expect(mockProfileRepository.update).toHaveBeenCalled();
  });

  it('refreshes gravatar when email changes', async () => {
    const existingProfile = createProfile(userId);
    mockProfileRepository.findByUserId.mockResolvedValue(existingProfile);
    mockProfileRepository.update.mockImplementation(async (profile: Profile) => profile);

    await service.refreshGravatar(userId, 'new@example.com');

    expect(mockProfileRepository.update).toHaveBeenCalled();
    const updatedProfile = mockProfileRepository.update.mock.calls[0][0] as Profile;
    expect(updatedProfile.gravatarUrl).toContain('gravatar');
  });
});

