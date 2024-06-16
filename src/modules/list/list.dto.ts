import { Type } from 'class-transformer';
import { IsNotEmpty, Length } from 'class-validator';
import { UserResponseDto } from '../user/user.dto';
import { OmitType } from '@nestjs/swagger';

export class ListDto {
  id: number;

  @IsNotEmpty()
  @Length(2, 40)
  name: string;

  @IsNotEmpty()
  owner: Partial<UserResponseDto>;

  coworkers?: Partial<UserResponseDto>[];

  createAt?: Date;
}

export class ListCreateDto extends OmitType(ListDto, ['id', 'owner']) {
  userId: number;
}

export class ListsDto {
  @Type(() => ListDto)
  data: ListDto[];
}
