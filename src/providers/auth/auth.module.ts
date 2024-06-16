import { Module } from '@nestjs/common';
import { AuthController } from './auth.controllor';
import { AuthService } from './auth.service';
import { UserModule } from '../../modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import config from 'src/config/config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    JwtModule.register({}),
    ConfigModule.forRoot({
      load: [config],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenStrategy, AccessTokenStrategy],
})
export class AuthModule {}
