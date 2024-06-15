import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Length } from 'class-validator';

export class TagDto {
  @ApiProperty({ example: 'Tag name', description: 'Tag name' })
  @Length(2, 40)
  name: string;
}

export class TagsDto {
  @Type(() => TagDto)
  data: TagDto[];
}
