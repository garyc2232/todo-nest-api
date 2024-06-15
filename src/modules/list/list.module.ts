import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { List } from './list.entity';
import { UserModule } from '../user/user.module';
import { ListSeeder } from './list.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([List]), forwardRef(() => UserModule)],
  controllers: [ListController],
  providers: [ListService, ListSeeder],
  exports: [ListService],
})
export class ListModule {}
