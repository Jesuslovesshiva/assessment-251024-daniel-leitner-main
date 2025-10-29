import { Profile } from '../entities/profile.entity';

export interface IProfileRepository {
  findByUserId(userId: string): Promise<Profile | null>;
  create(profile: Profile): Promise<Profile>;
  update(profile: Profile): Promise<Profile>;
}

export const PROFILE_REPOSITORY = 'IProfileRepository';

