import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { IsNumber } from 'class-validator';
import { User } from '../user/user.entity';

@Entity()
export class List {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column()
  name: string;

  @Column({ default: new Date().toISOString() })
  createAt: Date;

  @JoinTable()
  @ManyToOne(() => User)
  owner: User;

  @JoinTable()
  @ManyToMany(() => User)
  coworkers: User[];
}
