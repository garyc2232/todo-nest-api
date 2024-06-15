import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  MockRepository,
  repositoryMockFactory,
} from '../../utils/repositoryMockFactory';
import { UserService } from './user.service';
import { User } from './user.entity';

describe('UserService', () => {
  let service: UserService;

  let repositoryMock: MockRepository<User>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory<User>,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repositoryMock = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all User', async () => {
      repositoryMock.find.mockReturnValue([
        { id: 1, name: 'user 1', password: 'password' },
        { id: 2, name: 'user 2', password: 'password' },
      ]);

      const result = await service.getAll();

      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOneById', () => {
    it('should return a User', async () => {
      const id = 1;
      repositoryMock.findOne.mockReturnValue({
        id: 1,
        name: 'user 1',
        password: 'password',
      });

      const result = await service.getOneByIdOrName({ id: id });

      expect(result).toBeDefined();
      expect(result.id).toEqual(id);
    });
  });

  describe('getOneByName', () => {
    it('should return a User', async () => {
      const name = 'user 1';
      repositoryMock.findOne.mockReturnValue({
        id: 1,
        name: 'user 1',
        password: 'password',
      });

      const result = await service.getOneByIdOrName({ name: name });

      expect(result).toBeDefined();
      expect(result.name).toEqual(name);
    });
  });

  describe('create', () => {
    it('should create a User', async () => {
      const user = { id: 1, name: 'user 1', password: 'password' };

      jest.spyOn(service, 'getOneByIdOrName').mockResolvedValue(null);

      const result = await service.create(user);
      expect(result).toBeDefined();
      expect(result.name).toEqual(user.name);
    });

    it('should throw an error if User already exists', async () => {
      const user = { id: 1, name: 'user 1', password: 'password' };

      jest
        .spyOn(service, 'getOneByIdOrName')
        .mockResolvedValue({ ...user, createAt: new Date(), salt: 'salt' });

      await expect(async () => {
        await service.create(user);
      }).rejects.toThrow('User already exists');
    });
  });

  describe('delete', () => {
    it('should delete a User', async () => {
      repositoryMock.delete.mockReturnValue({ affected: 1 });
      const id = 1;

      const result = await service.delete(id);

      expect(result).toBeDefined();
      expect(result.affected).toEqual(1);
    });
  });
});
