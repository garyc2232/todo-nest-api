import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './list.entity';
import { ListDto } from './list.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    private readonly userService: UserService,
  ) {}

  async getAll(): Promise<ListDto[]> {
    const list = await this.listRepository.find({ relations: ['owner'] });
    return list.map((list) => {
      const { password: _p, salt: _s, ...owner } = list.owner;
      return {
        ...list,
        owner,
      };
    });
  }

  getOne(id: number): Promise<List> {
    return this.listRepository.findOne({
      where: { id },
    });
  }

  findByOwnerId(id: number): Promise<List[]> {
    return this.listRepository.find({
      where: { owner: { id } },
    });
  }

  async create(list: ListDto): Promise<List> {
    try {
      const user = await this.userService.getOneByIdOrName({
        id: list.owner.id,
      });
      if (!user) {
        throw new HttpException('User not exists', HttpStatus.NOT_FOUND);
      }
      const { password: _p, salt: _s, ...owner } = user;

      list.owner = owner;

      return this.listRepository.save(list);
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  delete(id: number): Promise<DeleteResult> {
    return this.listRepository.delete({ id });
  }
}
