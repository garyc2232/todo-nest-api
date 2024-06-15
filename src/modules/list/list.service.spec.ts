import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  MockRepository,
  repositoryMockFactory,
} from '../../utils/repositoryMockFactory';
import { ListService } from './list.service';
import { List } from './list.entity';
import { ListDto } from './list.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

describe('ListService', () => {
  let service: ListService;
  let userService: UserService;

  let mockListData: ListDto[];
  let repositoryMock: MockRepository<List>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ListService,
        UserService,
        {
          provide: getRepositoryToken(List),
          useFactory: repositoryMockFactory<List>,
        },
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory<User>,
        },
      ],
    }).compile();

    service = module.get<ListService>(ListService);
    repositoryMock = module.get(getRepositoryToken(List));
    userService = module.get<UserService>(UserService);

    mockListData = [
      {
        id: 1,
        name: 'list 1',
        createAt: new Date('2024-06-14'),
        owner: { id: 1, name: 'user 1' },
      },
      {
        id: 2,
        name: 'list 2',
        createAt: new Date('2024-06-15'),
        owner: { id: 2, name: 'user 2' },
      },
    ];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all list', async () => {
      repositoryMock.find.mockReturnValue(mockListData);

      const result = await service.getAll();

      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne', () => {
    it('should return a list', async () => {
      repositoryMock.findOne.mockReturnValue(mockListData[0]);

      const result = await service.getOne(mockListData[0].id);

      expect(result).toBeDefined();
      expect(result.id).toEqual(mockListData[0].id);
    });
  });

  describe('create', () => {
    it('should create a list', async () => {
      repositoryMock.save.mockReturnValue(mockListData[0]);
      jest.spyOn(userService, 'getOneByIdOrName').mockResolvedValue({
        id: 1,
        name: 'user 1',
        password: 'password',
        salt: 'salt',
        createAt: new Date('2024-06-14'),
      });
      const result = await service.create(mockListData[0]);

      expect(result).toBeDefined();
      expect(result.name).toEqual(mockListData[0].name);
    });

    it('should throw an error if User not exists', async () => {
      repositoryMock.save.mockReturnValue(mockListData[0]);
      jest.spyOn(userService, 'getOneByIdOrName').mockResolvedValue(null);

      await expect(async () => {
        await service.create(mockListData[0]);
      }).rejects.toThrow('User not exists');
    });
  });

  describe('delete', () => {
    it('should delete a list', async () => {
      repositoryMock.delete.mockReturnValue({ affected: 1 });

      const result = await service.delete(mockListData[0].id);

      expect(result).toBeDefined();
      expect(result.affected).toEqual(1);
    });
  });
});
