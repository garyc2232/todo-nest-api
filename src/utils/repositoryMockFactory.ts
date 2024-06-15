import { Repository } from 'typeorm';

type MockType<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof T]?: jest.Mock<{}>;
};

export type MockRepository<T> = MockType<Repository<T>>;

export const repositoryMockFactory = <T>(): MockType<Repository<T>> => ({
  findOne: jest.fn((entity: T) => entity),
  find: jest.fn((entity: T) => entity),
  delete: jest.fn((entity: T) => entity),
  save: jest.fn((entity: T) => entity),
});
