import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserController } from './presentation/controller/user.controller';
import { UserService } from './application/services/user.service';
import { UserPrismaRepository } from './infrastructure/repositories/user-prisma.repository';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';
import { ProfileService } from './application/services/profile.service';
import { ProfilePrismaRepository } from './infrastructure/repositories/profile-prisma.repository';
import { PROFILE_REPOSITORY } from './domain/repositories/profile.repository.interface';
import { ProfileController } from './presentation/controller/profile.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UserController, ProfileController],
  providers: [
    UserService,
    ProfileService,
    {
      provide: USER_REPOSITORY,
      useClass: UserPrismaRepository,
    },
    {
      provide: PROFILE_REPOSITORY,
      useClass: ProfilePrismaRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
