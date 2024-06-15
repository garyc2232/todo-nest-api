import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';

@Injectable()
export class UserSeeder implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
  ) {}

  async onModuleInit() {
    if ((await this.userRepository.count()) === 0) {
      for (let i = 0; i < 2; ++i) {
        await this.userService.create({
          id: i + 1,
          name: `User${i + 1}`,
          password: 'password',
        });
      }
    }
  }
}
