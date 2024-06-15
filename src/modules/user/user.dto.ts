import { IsNotEmpty, Length } from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';

export class UserDto {
  id: number;

  @IsNotEmpty()
  @Length(2, 40)
  name: string;

  @IsNotEmpty()
  @Length(3, 12)
  password: string;

  createAt?: Date;
}

export class UserResponseDto extends OmitType(UserDto, ['password'] as const) {}
