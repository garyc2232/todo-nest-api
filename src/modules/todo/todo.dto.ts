import { Transform, Type } from 'class-transformer';
import { IsDate, IsIn, IsNumber, IsOptional, Length } from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';
import { Tag } from '../tag/tag.entity';
import { Status } from '../status/status.entity';
import { List } from '../list/list.entity';

export class TodoDto {
  @Length(2, 40)
  name: string;
  @Length(0, 200)
  description: string;

  createAt: Date;
  @IsDate()
  @Transform(({ value }) => value && new Date(value))
  dueDate: Date;

  priority: number;
  tags: Tag[];
  status?: Status;
}

export class TodoFilterOptionsDto {
  status?: Status['name'];
  tags?: string;
}
export class TodoSortingOptionsDto {
  @IsOptional()
  @IsIn(['id', 'name', 'dueDate', 'priority', 'status'])
  sortBy?: 'id' | 'name' | 'dueDate' | 'priority' | 'status';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  @Transform(({ value }) => value && value.toUpperCase())
  sortOrder?: 'ASC' | 'DESC';
}

export class TodoCreatePayloadDto extends OmitType(TodoDto, ['status']) { }
export class TodoCreateDto extends TodoCreatePayloadDto {
  @IsNumber()
  list: List;
}

export class TodoResponseDto extends OmitType(TodoDto, ['tags', 'status']) {
  tags: Tag['name'][];
  status: Status['name'];
}

export class TodoUpdateDto extends OmitType(TodoDto, ['tags', 'status']) {
  @IsNumber()
  id: number;

  tags: Tag['id'][];
  status: Status['id'];
}

export class TodosDto {
  @Type(() => TodoDto)
  data: TodoDto[];
}
