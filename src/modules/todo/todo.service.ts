import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { TodoDto, TodoUpdateDto } from './todo.dto';
import { TagService } from '../tag/tag.service';
import { StatusService } from '../status/status.service';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    private readonly tagService: TagService,
    private readonly statusService: StatusService,
  ) {}

  getAll(): Promise<Todo[]> {
    return this.todoRepository.find({ relations: ['tags', 'status'] });
  }

  getOne(id: number): Promise<Todo> {
    return this.todoRepository.findOne({
      where: { id },
    });
  }

  async create(todo: TodoDto): Promise<Todo> {
    const tags = await this.tagService.find([...todo.tags.map((t) => t.id)]);

    todo.tags = tags;
    return this.todoRepository.save(todo);
  }

  async update(todo: TodoUpdateDto): Promise<Todo> {
    const oldTodo = await this.todoRepository.findOne({
      where: { id: todo.id },
      relations: ['tags', 'status'],
    });

    if (todo?.id !== oldTodo?.id) {
      throw new HttpException(
        `todo with id ${todo.id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (!!todo.tags) {
      const tags = await this.tagService.find([...todo.tags.map((t) => t.id)]);
      todo.tags = tags;
    }
    if (!!todo.status) {
      const status = await this.statusService.getOne(todo.status.id);
      todo.status = status;
    }

    const newTodo = {
      ...oldTodo,
      ...todo,
    };

    return this.todoRepository.save(newTodo);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.todoRepository.delete({ id });
  }
}
