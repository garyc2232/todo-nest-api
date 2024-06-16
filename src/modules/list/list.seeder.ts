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
      const listName = ['Pending', 'Urgent', 'Work', 'Home'];
      const numberOfUser = 2;
      let listId = 1;

      for (let i = 0; i < numberOfUser; ++i) {
        const promise = listName.map((name) => {
          this.listService.create({
            id: listId++,
            name,
            owner: {
              id: i + 1,
            },
          });
        });
        await Promise.all(promise);
      }
    }
  }
}
