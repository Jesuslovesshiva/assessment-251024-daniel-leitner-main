import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Profile } from '../../domain/entities/profile.entity';
import {
  PROFILE_REPOSITORY,
  IProfileRepository,
} from '../../domain/repositories/profile.repository.interface';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../domain/repositories/user.repository.interface';
import { getGravatarUrl } from '../utils/gravatar.util';

export interface UpdateProfileData {
  bio?: string;
  position?: string;
  department?: string;
  linkedinUrl?: string | null;
}

@Injectable()
export class ProfileService {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: IProfileRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async getByUserId(userId: string): Promise<Profile> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const existingProfile = await this.profileRepository.findByUserId(userId);
    if (existingProfile) {
      return existingProfile;
    }

    return this.createDefaultProfile(user.id, user.getEmailAsString());
  }

  async update(userId: string, data: UpdateProfileData): Promise<Profile> {
    const profile = await this.getByUserId(userId);

    let cleanedLinkedIn: string | null | undefined;
    if (typeof data.linkedinUrl === 'string') {
      cleanedLinkedIn = data.linkedinUrl.trim().length === 0 ? null : data.linkedinUrl.trim();
    } else if (data.linkedinUrl === null) {
      cleanedLinkedIn = null;
    } else {
      cleanedLinkedIn = undefined;
    }

    const updated = profile.update({
      bio: data.bio,
      position: data.position,
      department: data.department,
      linkedinUrl: cleanedLinkedIn,
    });

    return this.profileRepository.update(updated);
  }

  async refreshGravatar(userId: string, email: string): Promise<void> {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      await this.createDefaultProfile(userId, email);
      return;
    }

    const updated = profile.update({ gravatarUrl: getGravatarUrl(email) });
    await this.profileRepository.update(updated);
  }

  async ensureProfile(userId: string, email: string): Promise<Profile> {
    const existing = await this.profileRepository.findByUserId(userId);
    if (existing) {
      return existing;
    }

    return this.createDefaultProfile(userId, email);
  }

  private async createDefaultProfile(userId: string, email: string): Promise<Profile> {
    const profile = Profile.create({
      id: randomUUID(),
      userId,
      bio: 'Add a short bio to share more about yourself.',
      position: 'Not specified',
      department: 'Not specified',
      linkedinUrl: null,
      gravatarUrl: getGravatarUrl(email),
    });

    return this.profileRepository.create(profile);
  }
}

