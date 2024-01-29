import { Injectable } from '@nestjs/common';
import { UserModel } from '../infrastructure/models/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { loginRegisterUserDTO } from './dto/user.dto';
import { hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepo: Repository<UserModel>,
  ) {}

  async getUser() {
    const data = await this.userRepo.find({});
    return data;
  }

  async createUser({ email, password }: loginRegisterUserDTO) {
    const hashedPassword = await hash(password, 8);

    const newUserData = {
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const user = this.userRepo.create(newUserData);
    return await this.userRepo.save(user);
  }

  async getUserbyEmail(email: string) {
    const user = await this.userRepo.findOne({
      select: {
        email: true,
        id: true,
        password: true,
      },
      where: {
        email,
      },
    });
    return user;
  }
}
