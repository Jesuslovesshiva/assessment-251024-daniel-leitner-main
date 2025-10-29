import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User } from '../../domain/entities/user.entity';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../domain/repositories/user.repository.interface';
import { Profile } from '../../domain/entities/profile.entity';
import { ProfileService } from './profile.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly profileService: ProfileService,
  ) {}

  async create(data: { name: string; email: string }): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new NotFoundException(`User with email ${data.email} already exists`);
    }

    const user = User.create(randomUUID(), data.name, data.email);

    const savedUser = await this.userRepository.save(user);

    await this.profileService.ensureProfile(savedUser.id, savedUser.getEmailAsString());

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async findAllWithProfiles(): Promise<Array<{ user: User; profile: Profile }>> {
    const users = await this.userRepository.findAll();
    const results = await Promise.all(
      users.map(async (user) => ({
        user,
        profile: await this.profileService.ensureProfile(user.id, user.getEmailAsString()),
      })),
    );

    return results;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findOneWithProfile(id: string): Promise<{ user: User; profile: Profile }> {
    const user = await this.findOne(id);
    const profile = await this.profileService.ensureProfile(id, user.getEmailAsString());

    return { user, profile };
  }

  async update(id: string, data: { name?: string; email?: string }): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (data.email && data.email !== user.getEmailAsString()) {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser && existingUser.id !== id) {
        throw new NotFoundException(`User with email ${data.email} already exists`);
      }
    }

    const updatedUser = user.update(data);
    const saved = await this.userRepository.save(updatedUser);

    if (data.email && data.email !== user.getEmailAsString()) {
      await this.profileService.refreshGravatar(id, saved.getEmailAsString());
    }

    return saved;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.userRepository.delete(id);

    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
