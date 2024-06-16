import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from './status.entity';
import { StatusDto } from './status.dto';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ) {}

  getAll(): Promise<Status[]> {
    return this.statusRepository.find();
  }

  getOne(id: number): Promise<Status> {
    return this.statusRepository.findOne({
      where: { id },
    });
  }

  getInitStatus(): Promise<Status> {
    return this.statusRepository.findOne({
      where: { sequence: 0 },
    });
  }

  create(todo: StatusDto): Promise<Status> {
    return this.statusRepository.save(todo);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.statusRepository.delete({ id });
  }
}
