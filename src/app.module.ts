import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthCheckModule } from './modules/healthCheck/healthCheck.module';
import { TagModule } from './modules/tag/tag.module';

@Module({
  imports: [HealthCheckModule, TagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
