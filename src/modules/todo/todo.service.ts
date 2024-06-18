import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import {
  TodoCreateDto,
  TodoFilterOptionsDto,
  TodoResponseDto,
  TodoSortingOptionsDto,
  TodoUpdateDto,
} from './todo.dto';
import { TagService } from '../tag/tag.service';
import { StatusService } from '../status/status.service';
import { ListDto } from '../list/list.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    private readonly tagService: TagService,
    private readonly statusService: StatusService,
  ) {}

  async getAll(
    listId: ListDto['id'],
    sortingOption: TodoSortingOptionsDto,
    filterOptions: TodoFilterOptionsDto,
  ): Promise<TodoResponseDto[]> {
    const { status, tags } = filterOptions;
    const { sortBy = 'id', sortOrder = 'DESC' } = sortingOption;

    const queryBuilder = this.todoRepository.createQueryBuilder('todo');
    queryBuilder.leftJoinAndSelect('todo.status', 'status');
    queryBuilder.leftJoinAndSelect('todo.tags', 'tags');
    queryBuilder.where('todo.list = :listId', { listId });

    if (status) {
      queryBuilder.andWhere('status.name = :status', { status });
    }

    if (tags) {
      const tagNames = tags.split(',').map((tag) => tag.trim());
      queryBuilder.innerJoin('todo.tags', 'tag');
      queryBuilder.andWhere('tag.name IN (:...tagNames)', { tagNames });
    }

    if (sortBy === 'status') {
      queryBuilder.orderBy(
        'status.name',
        sortOrder.toUpperCase() as 'ASC' | 'DESC',
      );
    } else {
      queryBuilder.orderBy(
        `todo.${sortBy}`,
        sortOrder.toUpperCase() as 'ASC' | 'DESC',
      );
    }

    const todos = await queryBuilder.getMany();

    return todos.map((todo) => ({
      ...todo,
      status: todo.getStatusName(),
      tags: todo.getTagNames(),
    }));
  }

  async getOne(id: number): Promise<TodoResponseDto> {
    const todo = await this.todoRepository.findOne({
      where: { id },
      relations: ['tags', 'status'],
    });
    if (!todo) {
      throw new HttpException(
        `todo with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      ...todo,
      status: todo.getStatusName(),
      tags: todo.getTagNames(),
    };
  }

  async create(todo: TodoCreateDto): Promise<Todo> {
    const tags = await this.tagService.find([...todo.tags.map((t) => t.id)]);

    todo.tags = tags;
    const initStatus = await this.statusService.getInitStatus();
    const todoResult = await this.todoRepository.save({
      ...todo,
      status: initStatus,
    });

    return todoResult;
  }

  async update(todo: Partial<TodoUpdateDto>): Promise<any> {
    const oldTodo = await this.todoRepository.findOne({
      where: { id: todo.id },
      relations: ['tags', 'status'],
    });

    if (!oldTodo) {
      throw new HttpException(
        `todo with id ${todo.id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (!!todo.tags) {
      const tags = await this.tagService.find([...todo.tags]);
      oldTodo.tags = tags;
      delete todo.tags;
    }
    if (!!todo.status) {
      const status = await this.statusService.getOne(todo.status);
      oldTodo.status = status;
      delete todo.status;
    }

    const newTodo: any = {
      ...oldTodo,
      ...todo,
    };

    return this.todoRepository.save(newTodo);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.todoRepository.delete({ id });
  }
}
