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
import { TodoFilterOptionsDto, TodoSortingOptionsDto } from './todo.dto';

describe('TodoService', () => {
  let service: TodoService;
  let tagService: TagService;

  let repositoryMock: MockRepository<Todo>;
  let mockTodoData;
  let mockQueryBuilder;
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
        status: { id: 1, name: 'Not Start' },
        getStatusName: jest.fn().mockReturnValue('Not Start'),
        getTagNames: jest.fn().mockReturnValue(['Tag 1', 'Tag 2']),
      },
      {
        id: 2,
        name: 'todo ',
        description: 'description',
        tags: [
          { id: 1, name: 'Tag 1' },
          { id: 3, name: 'Tag 3' },
        ],
        status: { id: 2, name: 'Completed' },
        getStatusName: jest.fn().mockReturnValue('Completed'),
        getTagNames: jest.fn().mockReturnValue(['Tag 1', 'Tag 3']),
      },
    ];

    mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockTodoData),
    };
    repositoryMock.createQueryBuilder = jest
      .fn()
      .mockReturnValue(mockQueryBuilder);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all Todos', async () => {
      const sortingOption: TodoSortingOptionsDto = {};
      const filterOptions: TodoFilterOptionsDto = {};

      const mockListId = 1;
      const result = await service.getAll(
        mockListId,
        sortingOption,
        filterOptions,
      );

      expect(result).toBeInstanceOf(Array);
      expect(result[0].status).toBe('Not Start');
      expect(result[0].tags).toEqual(['Tag 1', 'Tag 2']);
    });

    it('should return all Todos with Filtering', async () => {
      const listId = 1;
      const sortingOption: TodoSortingOptionsDto = {};
      const filterOptions: TodoFilterOptionsDto = {
        status: 'In Progress',
        tags: 'Tag 1, Tag 2',
      };

      await service.getAll(listId, sortingOption, filterOptions);

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'todo.list = :listId',
        { listId },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'status.name = :status',
        { status: 'In Progress' },
      );
      expect(mockQueryBuilder.innerJoin).toHaveBeenCalledWith(
        'todo.tags',
        'tag',
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'tag.name IN (:...tagNames)',
        { tagNames: ['Tag 1', 'Tag 2'] },
      );
    });

    it('should return all Todos with Sorting ASC by Todo name', async () => {
      const listId = 1;
      const sortingOption: TodoSortingOptionsDto = {
        sortBy: 'name',
        sortOrder: 'ASC',
      };
      const filterOptions: TodoFilterOptionsDto = {};

      await service.getAll(listId, sortingOption, filterOptions);

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('todo.name', 'ASC');
    });

    it('should return all Todos with Sorting DESC by Status name', async () => {
      const listId = 1;
      const sortingOption: TodoSortingOptionsDto = {
        sortBy: 'status',
        sortOrder: 'DESC',
      };
      const filterOptions: TodoFilterOptionsDto = {};

      await service.getAll(listId, sortingOption, filterOptions);

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'status.name',
        'DESC',
      );
    });
  });

  describe('getOneById', () => {
    it('should return a Todo', async () => {
      const id = mockTodoData[0].id;
      repositoryMock.findOne.mockReturnValue(mockTodoData[0]);

      const result = await service.getOne(id);

      expect(result).toBeDefined();
      expect(result.name).toEqual(mockTodoData[0].name);
    });

    it('should throw an error if Todo not found', async () => {
      const id = mockTodoData[0].id;
      repositoryMock.findOne.mockReturnValue(null);

      await expect(async () => {
        await service.getOne(id);
      }).rejects.toThrow(`todo with id ${id} not found`);
    });
  });

  describe('getOne', () => {
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

  describe('update', () => {
    it('should update a Todo', async () => {
      repositoryMock.findOne.mockReturnValue(mockTodoData[0]);
      jest
        .spyOn(tagService, 'find')
        .mockResolvedValue([{ id: 2, name: 'Tag 2' }]);

      const result = await service.update({
        id: 1,
        name: 'updated',
        description: 'Update description',
        tags: [2],
      });

      expect(result).toBeDefined();
      expect(result.name).toEqual('updated');
      expect(result.description).toEqual('Update description');
      expect(result.tags).toEqual([{ id: 2, name: 'Tag 2' }]);
    });

    it('should throw error if todo not found', async () => {
      const todo = mockTodoData[0];

      repositoryMock.findOne.mockReturnValue(null);

      await expect(async () => {
        await service.update(todo);
      }).rejects.toThrow(`todo with id ${todo.id} not found`);
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
