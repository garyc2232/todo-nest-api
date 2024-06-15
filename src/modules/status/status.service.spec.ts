import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  MockRepository,
  repositoryMockFactory,
} from '../../utils/repositoryMockFactory';
import { StatusService } from './status.service';
import { Status } from './status.entity';

describe('StatusService', () => {
  let service: StatusService;

  let repositoryMock: MockRepository<Status>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        StatusService,
        {
          provide: getRepositoryToken(Status),
          useFactory: repositoryMockFactory<Status>,
        },
      ],
    }).compile();

    service = module.get<StatusService>(StatusService);
    repositoryMock = module.get(getRepositoryToken(Status));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all status', async () => {
      repositoryMock.find.mockReturnValue([
        { id: 1, name: 'status 1', sequence: 1 },
        { id: 2, name: 'status 2', sequence: 2 },
      ]);

      const result = await service.getAll();

      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne', () => {
    it('should return a status', async () => {
      const id = 1;
      repositoryMock.findOne.mockReturnValue({
        id: 1,
        name: 'status 1',
        sequence: 1,
      });

      const result = await service.getOne(id);

      expect(result).toBeDefined();
      expect(result.id).toEqual(id);
    });
  });

  describe('create', () => {
    it('should create a status', async () => {
      const status = { name: 'Test', sequence: 1 };

      repositoryMock.save.mockReturnValue({ id: 1, ...status });

      const result = await service.create(status);
      expect(result).toBeDefined();
      expect(result.name).toEqual(status.name);
    });
  });

  describe('delete', () => {
    it('should delete a status', async () => {
      repositoryMock.delete.mockReturnValue({ affected: 1 });
      const id = 1;

      const result = await service.delete(id);

      expect(result).toBeDefined();
      expect(result.affected).toEqual(1);
    });
  });
});
