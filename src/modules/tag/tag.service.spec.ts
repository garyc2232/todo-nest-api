import { Test } from '@nestjs/testing';
import { TagService } from './tag.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import {
  MockRepository,
  repositoryMockFactory,
} from '../../utils/repositoryMockFactory';

describe('TagService', () => {
  let service: TagService;

  let repositoryMock: MockRepository<Tag>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TagService,
        {
          provide: getRepositoryToken(Tag),
          useFactory: repositoryMockFactory<Tag>,
        },
      ],
    }).compile();

    service = module.get<TagService>(TagService);
    repositoryMock = module.get(getRepositoryToken(Tag));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all tags', async () => {
      repositoryMock.find.mockReturnValue([
        { id: 1, name: 'tag 1' },
        { id: 2, name: 'tag 2' },
      ]);

      const result = await service.getAll();

      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne', () => {
    it('should return a tag', async () => {
      const id = 1;
      repositoryMock.findOne.mockReturnValue({ id: 1, name: 'tag 1' });

      const result = await service.getOne(id);

      expect(result).toBeDefined();
      expect(result.id).toEqual(id);
    });
  });

  describe('find', () => {
    it('should return tags', async () => {
      const ids = [1, 2];
      repositoryMock.find.mockReturnValue([
        { id: 1, name: 'tag 1' },
        { id: 2, name: 'tag 2' },
      ]);

      const result = await service.find(ids);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toEqual(ids.length);
      expect(result.map((tag) => tag.id)).toEqual(ids);
    });
  });

  describe('create', () => {
    it('should create a tag', async () => {
      const tag = { name: 'Test' };

      repositoryMock.save.mockReturnValue({ id: 1, ...tag });

      const result = await service.create(tag);
      expect(result).toBeDefined();
      expect(result.name).toEqual(tag.name);
    });
  });

  describe('delete', () => {
    it('should delete a tag', async () => {
      repositoryMock.delete.mockReturnValue({ affected: 1 });
      const id = 1;

      const result = await service.delete(id);

      expect(result).toBeDefined();
      expect(result.affected).toEqual(1);
    });
  });
});
