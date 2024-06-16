import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  name: string;

  @Column()
  password: string;

  @Column({ default: new Date().toISOString() })
  createAt: Date;

  @Column()
  salt: string;
}
