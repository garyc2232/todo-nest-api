import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Length } from 'class-validator';

export class StatusDto {
  @ApiProperty({ example: 'In Review', description: 'Status name' })
  @Length(2, 40)
  name: string;

  @ApiProperty({ example: '1', description: 'Status sequence number' })
  sequence: number;
}

export class StatusesDto {
  @Type(() => StatusDto)
  data: StatusDto[];
}
