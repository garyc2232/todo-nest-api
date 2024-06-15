import { Module } from '@nestjs/common';
import { AuthController } from './auth.controllor';
import { AuthService } from './auth.service';
import { UserModule } from '../../modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { RtStrategy } from './strategies/rt.strategy';
import { AtStrategy } from './strategies/at.strategy';
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
  providers: [AuthService, RtStrategy, AtStrategy],
})
export class AuthModule {}
