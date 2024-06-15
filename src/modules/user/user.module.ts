import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSeeder } from './user.seeder';
import { ListModule } from '../list/list.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => ListModule)],
  controllers: [UserController],
  providers: [UserService, UserSeeder],
  exports: [UserService],
})
export class UserModule {}
