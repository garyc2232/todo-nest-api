import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Status {
  @ApiProperty({ example: 1, description: 'Status id' })
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'Status name', description: 'Status name' })
  @Column()
  name: string;

  @ApiProperty({ example: 'Status sequence', description: 'Status sequence' })
  @Column()
  sequence: number;
}
