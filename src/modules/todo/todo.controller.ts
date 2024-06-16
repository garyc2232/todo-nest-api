import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';
import { TodoDto } from './todo.dto';
import { TodoInterceptor } from './todo.interceptor';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('todo')
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get(':id')
  // @UseInterceptors(TodoInterceptor)
  getOne(@Param('id') id: number): Promise<Todo> {
    return this.todoService.getOne(id);
  }

  @Post()
  create(@Body() payload: TodoDto): Promise<Todo> {
    return this.todoService.create(payload);
  }

  @Patch(':id')
  @UseInterceptors(TodoInterceptor)
  update(
    @Param('id') id: number,
    @Body() payload: Partial<TodoDto>,
  ): Promise<Todo> {
    return this.todoService.update({ id, ...payload });
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.todoService.delete(id);
  }
}
