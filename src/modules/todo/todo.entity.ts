import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  Index,
} from 'typeorm';
import { Tag } from '../tag/tag.entity';
import { IsNumber } from 'class-validator';
import { List } from '../list/list.entity';
import { Status } from '../status/status.entity';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: new Date().toISOString() })
  createAt: Date;

  @Column()
  dueDate: Date;

  @Column()
  @Index()
  priority: number;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @ManyToOne(() => List)
  @JoinTable()
  listId: List['id'];

  @ManyToOne(() => Status)
  @JoinTable()
  status: Status;
}