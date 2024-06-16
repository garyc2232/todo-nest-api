import { Transform, Type } from 'class-transformer';
import { IsDate, IsNumber, Length } from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';
import { Tag } from '../tag/tag.entity';
import { Status } from '../status/status.entity';

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

export class TodoCreatePayloadDto extends OmitType(TodoDto, ['status']) {}
export class TodoCreateDto extends TodoCreatePayloadDto {
  @IsNumber()
  listId: number;
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
