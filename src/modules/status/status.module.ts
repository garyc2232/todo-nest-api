import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import { Status } from './status.entity';
import { StatusSeeder } from './status.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Status])],
  controllers: [StatusController],
  providers: [StatusService, StatusSeeder],
  exports: [StatusService],
})
export class StatusModule {}
