import { Injectable } from '@nestjs/common';
import { DeleteResult, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TagDto } from './tag.dto';
import { Tag } from './tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  getAll(): Promise<Tag[]> {
    return this.tagRepository.find();
  }

  getOne(id: number): Promise<Tag> {
    return this.tagRepository.findOne({
      where: { id },
    });
  }

  find(ids: number[]): Promise<Tag[]> {
    return this.tagRepository.find({ where: { id: In([...ids]) } });
  }

  create(todo: TagDto): Promise<Tag> {
    return this.tagRepository.save(todo);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.tagRepository.delete({ id });
  }
}
