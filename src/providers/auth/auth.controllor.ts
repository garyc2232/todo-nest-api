import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from '../../modules/user/user.dto';
import { JwtPayload, Tokens } from './jwt.type';
import { Public } from '../decorators/public.decorator';
import { RefreshTokenGuard } from '../guards/refreshToken.guard';
import { GetCurrentUser } from '../decorators/getCurrentUser.decorator';
import { GetCurrentUserId } from '../decorators/getCurrentUserId.decorator';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('/auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signIn')
  @Public()
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'successful' })
  @ApiBody({ type: UserDto, description: 'User name and password' })
  @HttpCode(HttpStatus.OK)
  async singIn(
    @Body() payload: Partial<UserDto>,
  ): Promise<Tokens & Partial<UserDto>> {
    return await this.authService.signIn(payload);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser() user: JwtPayload,
  ): Promise<Tokens & Partial<UserDto>> {
    return this.authService.refreshTokens(userId, user);
  }
}
