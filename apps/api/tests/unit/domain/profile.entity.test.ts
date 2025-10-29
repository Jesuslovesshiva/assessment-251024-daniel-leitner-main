import { describe, it, expect } from 'vitest';
import { Profile } from '../../../src/modules/core/domain/entities/profile.entity';
import { ProfileValidationError } from '../../../src/modules/core/domain/errors';

const validProfileData = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  userId: '0f5ae2a0-2a37-4a64-8e71-9c5530b6b0f1',
  bio: 'Seasoned engineer',
  position: 'Staff Engineer',
  department: 'Engineering',
  linkedinUrl: 'https://www.linkedin.com/in/example',
  gravatarUrl: 'https://www.gravatar.com/avatar/test?d=identicon',
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
} as const;

describe('Profile Entity', () => {
  it('creates a profile from persistence data', () => {
    const profile = Profile.fromPersistence(validProfileData);

    expect(profile.id).toBe(validProfileData.id);
    expect(profile.userId).toBe(validProfileData.userId);
    expect(profile.linkedinUrl).toBe(validProfileData.linkedinUrl);
  });

  it('throws when gravatar url is empty', () => {
    expect(() =>
      Profile.fromPersistence({
        ...validProfileData,
        gravatarUrl: '',
      }),
    ).toThrow(ProfileValidationError);
  });

  it('throws when linkedin url is invalid', () => {
    expect(() =>
      Profile.fromPersistence({
        ...validProfileData,
        linkedinUrl: 'not-a-valid-url',
      }),
    ).toThrow(ProfileValidationError);
  });

  it('allows nullable linkedin url', () => {
    const profile = Profile.fromPersistence({
      ...validProfileData,
      linkedinUrl: null,
    });

    expect(profile.linkedinUrl).toBeNull();
  });
});

