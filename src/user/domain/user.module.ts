import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from '../application/user.resolvers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from '../infrastructure/models/user.model';
import { AuthModule } from 'src/shared/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel]), forwardRef(() => AuthModule)],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
