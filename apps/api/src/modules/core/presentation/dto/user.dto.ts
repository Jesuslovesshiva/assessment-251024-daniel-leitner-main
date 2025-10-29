import { createZodDto } from 'nestjs-zod';
import { CreateUserSchema, UpdateUserSchema, UserResponseSchema } from '@assessment/schemas';
import { User } from '../../domain/entities/user.entity';
import { Profile } from '../../domain/entities/profile.entity';

export class UserDto extends createZodDto(UserResponseSchema) {
  static fromEntity(entity: User, profile?: Profile | null): UserDto {
    return {
      id: entity.id,
      name: entity.getNameAsString(),
      email: entity.getEmailAsString(),
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
      profile: profile
        ? {
            id: profile.id,
            userId: profile.userId,
            bio: profile.bio,
            position: profile.position,
            department: profile.department,
            linkedinUrl: profile.linkedinUrl ?? null,
            gravatarUrl: profile.gravatarUrl,
            createdAt: profile.createdAt.toISOString(),
            updatedAt: profile.updatedAt.toISOString(),
          }
        : null,
    };
  }

  static fromEntities(entities: Array<{ user: User; profile?: Profile | null }>): UserDto[] {
    return entities.map(({ user, profile }) => this.fromEntity(user, profile));
  }
}

export class CreateUserDto extends createZodDto(CreateUserSchema) {}

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
