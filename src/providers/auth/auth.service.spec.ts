import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '../../utils/repositoryMockFactory';
import { AuthService } from './auth.service';
import { UserService } from '../../modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../../modules/user/user.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let configService: ConfigService;
  const tokens = { accessToken: 'jwtToken', refreshToken: 'jwtToken' };
  const user: User = {
    id: 1,
    name: 'test',
    password: 'test',
    salt: 'test',
    createAt: new Date(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        JwtService,
        ConfigService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory<User>,
        },
      ],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UserService>(UserService);
    jwtService = moduleRef.get<JwtService>(JwtService);
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  describe('signIn', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should return tokens and user info', async () => {
      const userInfo = { name: 'test', password: 'test' };

      (bcrypt.compareSync as jest.Mock) = jest.fn().mockReturnValue(true);

      jest.spyOn(userService, 'getOneByIdOrName').mockResolvedValue(user);
      jest.spyOn(service, 'getTokens').mockResolvedValue(tokens);

      const result = await service.signIn(userInfo);

      expect(result).toEqual({
        id: user.id,
        name: user.name,
        ...tokens,
      });
    });

    it('should throw an error if user not found', async () => {
      const userInfo = { name: 'test', password: 'test' };

      jest.spyOn(userService, 'getOneByIdOrName').mockResolvedValue(null);

      await expect(async () => {
        await service.signIn(userInfo);
      }).rejects.toThrow('Incorrect username or password.');
    });

    it('should throw an error if password not match', async () => {
      const userInfo = { name: 'test', password: 'wrongPassword' };
      const tokens = { accessToken: 'at', refreshToken: 'rt' };

      (bcrypt.compareSync as jest.Mock) = jest.fn().mockReturnValue(false);

      jest.spyOn(userService, 'getOneByIdOrName').mockResolvedValue(user);

      await expect(async () => {
        await service.signIn(userInfo);
      }).rejects.toThrow('Incorrect username or password.');
    });
  });

  describe('getTokens', () => {
    it('should generate JWT tokens', async () => {
      const mockData = { userId: 1, name: 'test' };

      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('jwtToken');

      const result = await service.getTokens(mockData.userId, mockData.name);
      expect(result.accessToken).toEqual(tokens.accessToken);
      expect(result.refreshToken).toEqual(tokens.refreshToken);
    });
  });

  describe('refreshTokens', () => {
    it('should generate refresh tokens', async () => {
      const mockData = { userId: 1, user: { sub: 1, userName: 'test' } };

      jest.spyOn(userService, 'getOneByIdOrName').mockResolvedValue(user);
      jest.spyOn(service, 'getTokens').mockResolvedValue(tokens);

      const result = await service.refreshTokens(
        mockData.userId,
        mockData.user,
      );
      expect(result).toEqual({
        id: user.id,
        name: user.name,
        ...tokens,
      });
    });

    it('should throw an error if user not found', async () => {
      const mockData = { userId: 1, user: { sub: 1, userName: 'test' } };

      jest.spyOn(userService, 'getOneByIdOrName').mockResolvedValue(null);
      jest.spyOn(service, 'getTokens').mockResolvedValue(tokens);

      await expect(async () => {
        await service.refreshTokens(mockData.userId, mockData.user);
      }).rejects.toThrow('User not exists.');
    });
  });
});
