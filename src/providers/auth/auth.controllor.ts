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
import { RtGuard } from '../guards/rt.guard';
import { GetCurrentUser } from '../decorators/getCurrentUser.decorator';
import { GetCurrentUserId } from '../decorators/get-current-user-id.decorator';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signIn')
  @Public()
  @HttpCode(HttpStatus.OK)
  async singIn(@Body() payload: UserDto): Promise<Tokens & Partial<UserDto>> {
    return await this.authService.singIn(payload);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser() user: JwtPayload,
  ): Promise<Tokens & Partial<UserDto>> {
    return this.authService.refreshTokens(userId, user);
  }
}
