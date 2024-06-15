import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  @IsNumber()
  @ApiProperty({ example: 1, description: 'Tag id' })
  id: number;

  @Column()
  @ApiProperty({ example: 'tag 1', description: 'Tag name' })
  name: string;
}
