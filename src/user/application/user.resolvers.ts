import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from '../domain/user.service';
import { AuthUserInput, AuthUserResponse } from '../domain/dto/user.inputTypes';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth-guard';
import { UseGuards } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from '../infrastructure/models/user.model';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  @Query(() => UserModel, { name: 'getAllUser' })
  async getAllUser(): Promise<UserModel[]> {
    const data = await this.userService.getUser();
    return data;
  }

  @Mutation(() => AuthUserResponse, { name: 'registerUser' })
  async register(@Args('user') userData: AuthUserInput): Promise<AuthUserResponse> {
    const alreadyUser = await this.userService.getUserbyEmail(userData.email);

    if (alreadyUser) {
      throw new Error('User already registered. Try login!');
    }

    const user = await this.userService.createUser(userData);

    const payload = { email: user.email };

    return { email: user.email, accessToken: this.jwtService.sign(payload) };
  }

  @Mutation(() => AuthUserResponse, { name: 'loginUser' })
  async login(@Args('user') userData: AuthUserInput): Promise<AuthUserResponse> {
    const alreadyUser = await this.userService.getUserbyEmail(userData.email);

    if (!alreadyUser) {
      throw new Error('User not registered. Try Registering first!');
    }

    const passwordHasMatch = await compare(userData.password, alreadyUser.password);
    if (!passwordHasMatch) {
      throw new Error('Wrong Password.');
    }

    const payload = { email: alreadyUser.email };

    return { email: alreadyUser.email, accessToken: this.jwtService.sign(payload) };
  }
}
