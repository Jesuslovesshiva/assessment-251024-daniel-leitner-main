import { createZodDto } from 'nestjs-zod';
import { ProfileResponseSchema, UpdateProfileSchema } from '@assessment/schemas';
import { Profile } from '../../domain/entities/profile.entity';

export class ProfileDto extends createZodDto(ProfileResponseSchema) {
  static fromEntity(entity: Profile): ProfileDto {
    return {
      id: entity.id,
      userId: entity.userId,
      bio: entity.bio,
      position: entity.position,
      department: entity.department,
      linkedinUrl: entity.linkedinUrl ?? null,
      gravatarUrl: entity.gravatarUrl,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}

export class UpdateProfileDto extends createZodDto(UpdateProfileSchema) {}

