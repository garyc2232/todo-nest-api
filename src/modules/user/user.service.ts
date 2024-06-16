import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeleteResult, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  getAll(): Promise<User[]> {
    return this.userRepository.find({ select: ['id', 'name', 'createAt'] });
  }

  find(ids: number[]): Promise<User[]> {
    return this.userRepository.find({ where: { id: In([...ids]) } });
  }

  getOneByIdOrName(
    user: Partial<UserDto>,
    returnWithPassword = false,
  ): Promise<User> {
    if (!!user.id) {
      return this.userRepository.findOne({
        where: { id: user.id },
        select: !returnWithPassword && ['id', 'name', 'createAt'],
      });
    }
    if (!!user.name) {
      return this.userRepository.findOne({
        where: { name: user.name },
        select: !returnWithPassword && ['id', 'name', 'createAt'],
      });
    }
    return null;
  }

  async create(user: UserDto): Promise<User> {
    try {
      const isUserExist = await this.getOneByIdOrName({ name: user.name });
      if (isUserExist) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }

      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(user.password, salt);

      return this.userRepository.save({
        ...user,
        password: hash,
        salt,
      });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  delete(id: number): Promise<DeleteResult> {
    return this.userRepository.delete({ id });
  }
}
