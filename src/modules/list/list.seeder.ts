import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { List } from './list.entity';
import { ListService } from './list.service';

@Injectable()
export class ListSeeder implements OnModuleInit {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    private readonly listService: ListService,
  ) {}

  async onModuleInit() {
    if ((await this.listRepository.count()) === 0) {
      for (let i = 0; i < 2; ++i) {
        await this.listService.create({
          id: i + 1,
          name: `List ${i + 1}`,
          owner: {
            id: i + 1,
          },
        });
      }
    }
  }
}
