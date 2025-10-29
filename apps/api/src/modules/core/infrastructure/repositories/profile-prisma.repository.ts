import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Profile } from '../../domain/entities/profile.entity';
import { IProfileRepository } from '../../domain/repositories/profile.repository.interface';

@Injectable()
export class ProfilePrismaRepository implements IProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<Profile | null> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    return profile ? this.toDomain(profile) : null;
  }

  async create(profile: Profile): Promise<Profile> {
    const created = await this.prisma.profile.create({
      data: this.toPrisma(profile),
    });

    return this.toDomain(created);
  }

  async update(profile: Profile): Promise<Profile> {
    const updated = await this.prisma.profile.update({
      where: { userId: profile.userId },
      data: {
        bio: profile.bio,
        position: profile.position,
        department: profile.department,
        linkedinUrl: profile.linkedinUrl,
        gravatarUrl: profile.gravatarUrl,
        updatedAt: profile.updatedAt,
      },
    });

    return this.toDomain(updated);
  }

  private toDomain(prismaModel: {
    id: string;
    userId: string;
    bio: string;
    position: string;
    department: string;
    linkedinUrl: string | null;
    gravatarUrl: string;
    createdAt: Date;
    updatedAt: Date;
  }): Profile {
    return Profile.fromPersistence({
      id: prismaModel.id,
      userId: prismaModel.userId,
      bio: prismaModel.bio,
      position: prismaModel.position,
      department: prismaModel.department,
      linkedinUrl: prismaModel.linkedinUrl,
      gravatarUrl: prismaModel.gravatarUrl,
      createdAt: prismaModel.createdAt,
      updatedAt: prismaModel.updatedAt,
    });
  }

  private toPrisma(profile: Profile): {
    id: string;
    userId: string;
    bio: string;
    position: string;
    department: string;
    linkedinUrl: string | null;
    gravatarUrl: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: profile.id,
      userId: profile.userId,
      bio: profile.bio,
      position: profile.position,
      department: profile.department,
      linkedinUrl: profile.linkedinUrl,
      gravatarUrl: profile.gravatarUrl,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}

