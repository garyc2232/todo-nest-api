import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthCheckModule } from './modules/healthCheck/healthCheck.module';
import { TagModule } from './modules/tag/tag.module';
import { StatusModule } from './modules/status/status.module';
import { DatabaseModule } from './modules/providers/database/database.module';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';

@Module({
  imports: [
    HealthCheckModule,
    TagModule,
    StatusModule,
    DatabaseModule,
    ConfigModule.forRoot({
      load: [config],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
