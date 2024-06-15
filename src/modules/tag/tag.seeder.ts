import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Tag } from './tag.entity';

@Injectable()
export class TagSeeder implements OnModuleInit {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async onModuleInit() {
    if ((await this.tagRepository.count()) === 0) {
      for (let i = 0; i < 9; ++i) {
        await this.tagRepository.save({
          name: `Tag ${i + 1}`,
        });
      }
    }
  }
}
