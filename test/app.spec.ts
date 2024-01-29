import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from '../src/user/application/user.resolvers';
import { UserService } from '../src/user/domain/user.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthUserInput, AuthUserResponse } from '../src/user/domain/dto/user.inputTypes';
import * as bcrypt from 'bcryptjs';
import { UserModel } from '../src/user/infrastructure/models/user.model';

jest.mock('../src/user/domain/user.service');
jest.mock('@nestjs/jwt');
jest.mock('bcryptjs');

describe('UserResolver', () => {
  let userResolver: UserResolver;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        UserService,
        JwtService,
        {
          provide: getRepositoryToken(UserModel),
          useClass: Repository,
        },
      ],
    }).compile();

    userResolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('registerUser', () => {
    it('should register a new user and return an access token', async () => {
      const newUser: UserModel = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      const authUserInput: AuthUserInput = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(userService, 'getUserbyEmail').mockResolvedValue(null);
      jest.spyOn(userService, 'createUser').mockResolvedValue(newUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mockAccessToken');

      const result: AuthUserResponse = await userResolver.register(authUserInput);

      expect(result).toEqual({
        email: authUserInput.email,
        accessToken: 'mockAccessToken',
      });
    });

    it('should throw an error if the user is already registered', async () => {
      const authUserInput: AuthUserInput = {
        email: 'testUser@gmail.com',
        password: 'password123',
      };

      jest.spyOn(userService, 'getUserbyEmail').mockResolvedValue({
        id: '1',
        email: 'testUser@gmail.com',
        password: 'hashedPassword',
      });

      await expect(userResolver.register(authUserInput)).rejects.toThrowError('User already registered. Try login!');
    });
  });

  describe('loginUser', () => {
    it('should login a user and return an access token', async () => {
      const existingUser: UserModel = {
        id: '1',
        email: 'testUser@gmail.com',
        password: 'hashedPassword',
      };
      const authUserInput: AuthUserInput = {
        email: 'testUser@gmail.com',
        password: 'password123',
      };

      jest.spyOn(userService, 'getUserbyEmail').mockResolvedValue(existingUser);
      jest.spyOn(bcrypt as any, 'compare').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mockAccessToken');

      const result: AuthUserResponse = await userResolver.login(authUserInput);

      expect(result).toEqual({
        email: authUserInput.email,
        accessToken: 'mockAccessToken',
      });
    });

    it('should throw an error if the user is not registered', async () => {
      const authUserInput: AuthUserInput = {
        email: 'nonexistentUser@example.com',
        password: 'password123',
      };

      jest.spyOn(userService, 'getUserbyEmail').mockResolvedValue(null);

      await expect(userResolver.login(authUserInput)).rejects.toThrowError(
        'User not registered. Try Registering first!',
      );
    });

    it('should throw an error if the password does not match', async () => {
      const existingUser: UserModel = {
        id: '1',
        email: 'testUser@gmail.com',
        password: 'hashedPassword',
      };
      const authUserInput: AuthUserInput = {
        email: 'testUser@gmail.com',
        password: 'incorrectPassword',
      };

      jest.spyOn(userService, 'getUserbyEmail').mockResolvedValue(existingUser);
      jest.spyOn(bcrypt as any, 'compare').mockResolvedValue(false);

      await expect(userResolver.login(authUserInput)).rejects.toThrowError('Wrong Password.');
    });
  });
});
