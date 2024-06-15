import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: 5432,
      database: process.env.DB_NAME || 'todo-app',
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      autoLoadEntities: true,
      synchronize: true, // Set to false in production
    }),
  ],
})
export class DatabaseModule {}
