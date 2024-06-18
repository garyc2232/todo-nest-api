import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Status } from './status.entity';

@Injectable()
export class StatusSeeder implements OnModuleInit {
  constructor(
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ) {}

  async onModuleInit() {
    if ((await this.statusRepository.count()) === 0) {
      await this.statusRepository.save({ name: `Not Started`, sequence: 0 });
      await this.statusRepository.save({ name: `In Progress`, sequence: 1 });
      await this.statusRepository.save({ name: `Completed`, sequence: 2 });
    }
  }
}
