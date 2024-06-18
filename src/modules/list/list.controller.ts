import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DeleteResult } from 'typeorm';
import { ListService } from './list.service';
import { ListCreateDto, ListDto } from './list.dto';
import { List } from './list.entity';
import { GetCurrentUserId } from '../../providers/decorators/getCurrentUserId.decorator';
import { UserDto } from '../user/user.dto';
import { TodoService } from '../todo/todo.service';
import {
  TodoCreatePayloadDto,
  TodoFilterOptionsDto,
  TodoResponseDto,
  TodoSortingOptionsDto,
  TodoUpdateDto,
} from '../todo/todo.dto';
import { Todo } from '../todo/todo.entity';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('/list')
export class ListController {
  constructor(
    private readonly listService: ListService,
    private readonly todoService: TodoService,
  ) {}

  @ApiTags('list')
  @Get()
  getAllListByUserId(
    @GetCurrentUserId() userId: UserDto['id'],
  ): Promise<ListDto[]> {
    return this.listService.getAll(userId);
  }

  @ApiTags('todo')
  @ApiParam({ name: 'listId' })
  @Get('/:listId/todo')
  async getTodosByListId(
    @GetCurrentUserId() userId: UserDto['id'],
    @Param('listId') listId: List['id'],
    @Query() sortingOption: TodoSortingOptionsDto,
    @Query() filterOptions: TodoFilterOptionsDto,
  ): Promise<TodoResponseDto[]> {
    const list = await this.listService.getOne(userId, listId);

    return this.todoService.getAll(list.id, sortingOption, filterOptions);
  }

  @ApiTags('list')
  @ApiParam({ name: 'listId' })
  @Get(':listId')
  getOneListByUserId(
    @GetCurrentUserId() userId: UserDto['id'],
    @Param('listId') listId: List['id'],
  ): Promise<ListDto> {
    return this.listService.getOne(userId, listId);
  }

  @ApiTags('todo')
  @ApiParam({ name: 'listId' })
  @ApiParam({ name: 'todoId' })
  @Get('/:listId/todo/:todoId')
  async getOneTodoById(
    @GetCurrentUserId() userId: UserDto['id'],
    @Param('listId') listId: List['id'],
    @Param('todoId') todoId: Todo['id'],
  ): Promise<TodoResponseDto> {
    await this.listService.getOne(userId, listId);

    return this.todoService.getOne(todoId);
  }

  @ApiTags('list')
  @Post()
  create(
    @GetCurrentUserId() userId: UserDto['id'],
    @Body() payload: ListCreateDto,
  ): Promise<ListDto> {
    return this.listService.create(
      plainToInstance(ListDto, { ...payload, owner: { id: userId } }),
    );
  }

  @ApiTags('todo')
  @Post('/:listId/todo')
  async createTodo(
    @GetCurrentUserId() userId: UserDto['id'],
    @Param('listId') listId: List['id'],
    @Body() payload: TodoCreatePayloadDto,
  ): Promise<Todo> {
    const list = await this.listService.getOne(userId, listId);

    return this.todoService.create({
      ...payload,
      list,
    });
  }

  @ApiTags('todo')
  @ApiParam({ name: 'listId' })
  @ApiParam({ name: 'todoId' })
  @Patch(':listId/todo/:todoId')
  async patchTodo(
    @GetCurrentUserId() userId: UserDto['id'],
    @Param('listId') listId: List['id'],
    @Param('todoId') todoId: Todo['id'],
    @Body() payload: Partial<TodoUpdateDto>,
  ): Promise<Todo> {
    console.log(payload);
    await this.listService.getOne(userId, listId);

    return this.todoService.update({ id: Number(todoId), ...payload });
  }

  @ApiTags('list')
  @ApiParam({ name: 'listId' })
  @Delete(':listId')
  deleteList(
    @GetCurrentUserId() userId: UserDto['id'],
    @Param('listId') listId: ListDto['id'],
  ): Promise<DeleteResult> {
    return this.listService.delete(userId, listId);
  }

  @ApiTags('todo')
  @ApiParam({ name: 'listId' })
  @ApiParam({ name: 'todoId' })
  @Delete(':listId/todo/:todoId')
  async deleteTodo(
    @GetCurrentUserId() userId: UserDto['id'],
    @Param('listId') listId: List['id'],
    @Param('todoId') todoId: Todo['id'],
  ): Promise<DeleteResult> {
    await this.listService.getOne(userId, listId);

    return this.todoService.delete(todoId);
  }
}
