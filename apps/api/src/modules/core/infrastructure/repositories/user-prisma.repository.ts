import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<User> {
    const prismaData = this.toPrisma(user);

    const saved = await this.prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: prismaData.name,
        email: prismaData.email,
        updatedAt: prismaData.updatedAt,
      },
      create: prismaData,
    });

    return this.toDomain(saved);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? this.toDomain(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return users.map((user) => this.toDomain(user));
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email: email.toLowerCase() },
    });
    return count > 0;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    return user ? this.toDomain(user) : null;
  }

  private toDomain(prismaModel: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return User.fromPersistence({
      id: prismaModel.id,
      name: prismaModel.name,
      email: prismaModel.email,
      createdAt: prismaModel.createdAt,
      updatedAt: prismaModel.updatedAt,
    });
  }

  private toPrisma(user: User): {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: user.id,
      name: user.getNameAsString(),
      email: user.getEmailAsString(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
