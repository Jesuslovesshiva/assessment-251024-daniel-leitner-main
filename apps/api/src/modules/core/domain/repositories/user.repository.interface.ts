import { User } from '../entities/user.entity';

export interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  delete(id: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
  findByEmail(email: string): Promise<User | null>;
}

export const USER_REPOSITORY = 'IUserRepository';
