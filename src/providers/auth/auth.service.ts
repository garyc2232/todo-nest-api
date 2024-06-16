import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDto } from '../../modules/user/user.dto';
import { UserService } from '../../modules/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtPayload, Tokens } from './jwt.type';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async singIn(user: UserDto): Promise<Tokens & Partial<UserDto>> {
    const userInfo = await this.userService.getOneByIdOrName({
      name: user.name,
    });

    if (!userInfo)
      throw new UnauthorizedException('Incorrect username or password.');

    const isMatch = bcrypt.compareSync(
      user.password,
      (await userInfo).password,
    );

    if (!isMatch)
      throw new UnauthorizedException('Incorrect username or password.');

    const tokens = await this.getTokens(userInfo.id, userInfo.name);

    return {
      id: userInfo.id,
      name: userInfo.name,
      ...tokens,
    };
  }

  async refreshTokens(
    userId: number,
    user: JwtPayload,
  ): Promise<Tokens & Partial<UserDto>> {
    const userInfo = await this.userService.getOneByIdOrName({
      id: userId,
    });

    if (!userInfo) throw new UnauthorizedException('User not exists.');

    const tokens = await this.getTokens(userId, user.userName);

    return {
      id: userInfo.id,
      name: userInfo.name,
      ...tokens,
    };
  }

  async getTokens(userId: number, name: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      userName: name,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT.AT_SECRET'),
        expiresIn: '1m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT.RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }
}
