import { IsNotEmpty, Length } from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  id: number;

  @IsNotEmpty()
  @Length(2, 40)
  @ApiProperty({ example: 'User1', description: 'user name' })
  name: string;

  @IsNotEmpty()
  @Length(3, 12)
  @ApiProperty({ example: 'password', description: 'user password' })
  password: string;

  createAt?: Date;
}

export class UserResponseDto extends OmitType(UserDto, ['password'] as const) {}
