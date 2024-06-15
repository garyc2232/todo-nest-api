import { Module } from '@nestjs/common';
import { HealthCheckModule } from './modules/healthCheck/healthCheck.module';
import { TodoModule } from './modules/todo/todo.module';
import { DatabaseModule } from './providers/database/database.module';
import { UserModule } from './modules/user/user.module';
import { TagModule } from './modules/tag/tag.module';
import { ListModule } from './modules/list/list.module';
import { StatusModule } from './modules/status/status.module';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { AuthModule } from './providers/auth/auth.module';
import { AtGuard } from './providers/guards/at.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    HealthCheckModule,
    TodoModule,
    UserModule,
    AuthModule,
    TagModule,
    DatabaseModule,
    ListModule,
    StatusModule,
    ConfigModule.forRoot({
      load: [config],
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
