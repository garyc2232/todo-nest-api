import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DeleteResult } from 'typeorm';
import { ListService } from './list.service';
import { ListDto } from './list.dto';
import { List } from './list.entity';
import { GetCurrentUserId } from 'src/providers/decorators/getCurrentUserId.decorator';
import { UserDto } from '../user/user.dto';
import { TodoService } from '../todo/todo.service';

@Controller('/list')
export class ListController {
  constructor(
    private readonly listService: ListService,
    private readonly todoService: TodoService,
  ) {}

  @Get()
  getAll(@GetCurrentUserId() userId: UserDto['id']): Promise<ListDto[]> {
    return this.listService.getAll(userId);
  }

  @Get('/:id/todo')
  async getAllTodoByListId(
    @GetCurrentUserId() userId: UserDto['id'],
    @Param('id') id: List['id'],
  ): Promise<any[]> {
    const list = await this.listService.getOne(userId, id);

    return this.todoService.getAll(list.id);
  }

  @Get(':id')
  getOne(
    @GetCurrentUserId() userId: UserDto['id'],
    @Param('id') id: List['id'],
  ): Promise<ListDto> {
    return this.listService.getOne(userId, id);
  }

  @Post()
  create(@Body() payload: ListDto): Promise<ListDto> {
    return this.listService.create(plainToInstance(ListDto, payload));
  }

  // @Post('/:id/todo')
  // async createTodo(
  //   @GetCurrentUserId() userId: UserDto['id'],
  //   @Param('id') id: List['id'],
  //   @Body() payload: TodoDto
  // ): Promise<TodoResponseDto> {
  //   const list = await this.listService.getOne(userId, id);

  //   return this.todoService.create({
  //     ...payload,
  //     listId: list.id,
  //   });
  // }

  @Delete(':id')
  delete(@Param('id') id: ListDto['id']): Promise<DeleteResult> {
    return this.listService.delete(id);
  }
}
