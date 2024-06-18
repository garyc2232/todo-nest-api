import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Todo } from './todo.entity';
import { TodoService } from './todo.service';
import { TodoCreateDto } from './todo.dto';

@Injectable()
export class TodoSeeder implements OnModuleInit {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    private readonly todoService: TodoService,
  ) {}

  async onModuleInit() {
    if ((await this.todoRepository.count()) === 0) {
      for (let i = 0; i < 9; ++i) {
        await this.todoService.create({
          name: `Todo ${i + 1}`,
          description: `description ${i + 1}`,
          dueDate: new Date(),
          priority: Math.floor(Math.random() * 10) + 1,
          list: {
            id: 1,
            name: 'Work',
          },
          tags: [
            {
              id: 1,
              name: 'Tag 1',
            },
          ],
        } as TodoCreateDto);
      }
    }
  }
}
