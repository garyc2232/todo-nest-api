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
import { Expose } from 'class-transformer';

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

  @ManyToOne(() => List, { onDelete: 'CASCADE' })
  @JoinTable()
  list: List;

  @ManyToOne(() => Status)
  @JoinTable()
  status: Status;

  @Expose({ name: 'status', toPlainOnly: true })
  getStatusName(): string {
    return this.status?.name;
  }

  @Expose({ name: 'tags', toPlainOnly: true })
  getTagNames(): string[] {
    return this.tags?.map((tag) => tag.name) || [];
  }
}
