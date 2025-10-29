import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfileService } from '../../application/services/profile.service';
import { ProfileDto, UpdateProfileDto } from '../dto/profile.dto';

@ApiTags('profiles')
@Controller('users/:id/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get profile for a user' })
  @ApiParam({ name: 'id', description: 'User ID (UUID)', type: String })
  @ApiResponse({ status: HttpStatus.OK, type: ProfileDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async getProfile(@Param('id') id: string): Promise<ProfileDto> {
    const profile = await this.profileService.getByUserId(id);
    return ProfileDto.fromEntity(profile);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update profile for a user' })
  @ApiParam({ name: 'id', description: 'User ID (UUID)', type: String })
  @ApiResponse({ status: HttpStatus.OK, type: ProfileDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileDto> {
    const profile = await this.profileService.update(id, updateProfileDto);
    return ProfileDto.fromEntity(profile);
  }
}

