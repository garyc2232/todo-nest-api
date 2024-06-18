import { Transform, Type } from 'class-transformer';
import { IsDate, IsIn, IsNumber, IsOptional, Length } from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';
import { Tag } from '../tag/tag.entity';
import { Status } from '../status/status.entity';
import { List } from '../list/list.entity';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({ required: false, example: 'In Progress' })
  status?: Status['name'];
  @ApiProperty({ required: false, example: 'Tag 1, Tag 2' })
  tags?: string;
}
export class TodoSortingOptionsDto {
  @IsOptional()
  @IsIn(['id', 'name', 'dueDate', 'priority', 'status'])
  @ApiProperty({
    required: false,
    enum: ['id', 'name', 'dueDate', 'priority', 'status'],
  })
  sortBy?: 'id' | 'name' | 'dueDate' | 'priority' | 'status';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  @Transform(({ value }) => value && value.toUpperCase())
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: 'ASC' | 'DESC';
}

export class TodoCreatePayloadDto extends OmitType(TodoDto, ['status']) {}
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
