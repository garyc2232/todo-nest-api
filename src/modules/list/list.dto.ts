import { Type } from 'class-transformer';
import { IsNotEmpty, Length } from 'class-validator';
import { UserResponseDto } from '../user/user.dto';

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

export class ListsDto {
  @Type(() => ListDto)
  data: ListDto[];
}
