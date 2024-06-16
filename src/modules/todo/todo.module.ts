import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { TodoService } from './todo.service';
import { Tag } from '../tag/tag.entity';
import { TagModule } from '../tag/tag.module';
import { StatusModule } from '../status/status.module';
import { TodoSeeder } from './todo.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, Tag]), TagModule, StatusModule],
  providers: [TodoService, TodoSeeder],
  exports: [TodoService],
})
export class TodoModule {}
