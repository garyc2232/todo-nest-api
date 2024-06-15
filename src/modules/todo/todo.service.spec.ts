import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  MockRepository,
  repositoryMockFactory,
} from '../../utils/repositoryMockFactory';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';
import { TagService } from '../tag/tag.service';
import { Tag } from '../tag/tag.entity';
import { StatusService } from '../status/status.service';
import { Status } from '../status/status.entity';

describe('TodoService', () => {
  let service: TodoService;
  let tagService: TagService;

  let repositoryMock: MockRepository<Todo>;
  let mockTodoData;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TodoService,
        TagService,
        StatusService,
        {
          provide: getRepositoryToken(Todo),
          useFactory: repositoryMockFactory<Todo>,
        },
        {
          provide: getRepositoryToken(Tag),
          useFactory: repositoryMockFactory<Tag>,
        },
        {
          provide: getRepositoryToken(Status),
          useFactory: repositoryMockFactory<Status>,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    tagService = module.get<TagService>(TagService);
    repositoryMock = module.get(getRepositoryToken(Todo));
    mockTodoData = [
      {
        id: 1,
        name: 'todo 1',
        description: 'description',
        tags: [
          { id: 1, name: 'Tag 1' },
          { id: 2, name: 'Tag 2' },
        ],
      },
      {
        id: 2,
        name: 'todo ',
        description: 'description',
        tags: [
          { id: 1, name: 'Tag 1' },
          { id: 2, name: 'Tag 2' },
        ],
      },
    ];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all Todos', async () => {
      repositoryMock.find.mockReturnValue(mockTodoData);

      const result = await service.getAll();

      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOneById', () => {
    it('should return a Todo', async () => {
      const id = mockTodoData[0].id;
      repositoryMock.findOne.mockReturnValue(mockTodoData[0]);

      const result = await service.getOne(id);

      expect(result).toBeDefined();
      expect(result.id).toEqual(id);
    });
  });

  describe('getOneByName', () => {
    it('should return a Todo', async () => {
      repositoryMock.findOne.mockReturnValue(mockTodoData[0]);

      const result = await service.getOne(mockTodoData[0].id);

      expect(result).toBeDefined();
      expect(result.name).toEqual(mockTodoData[0].name);
    });
  });

  describe('create', () => {
    it('should create a Todo', async () => {
      const todo = mockTodoData[0];

      jest.spyOn(tagService, 'find').mockResolvedValue([
        { id: 1, name: 'Tag 1' },
        { id: 2, name: 'Tag 2' },
      ]);

      const result = await service.create(todo);
      expect(result).toBeDefined();
      expect(result.name).toEqual(todo.name);
    });
  });

  describe('delete', () => {
    it('should delete a Todo', async () => {
      repositoryMock.delete.mockReturnValue({ affected: 1 });
      const id = 1;

      const result = await service.delete(id);

      expect(result).toBeDefined();
      expect(result.affected).toEqual(1);
    });
  });
});
