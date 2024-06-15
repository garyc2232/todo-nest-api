import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { Tag } from '../tag/tag.entity';
import { TagModule } from '../tag/tag.module';
import { StatusModule } from '../status/status.module';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, Tag]), TagModule, StatusModule],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
