import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

import { UserDTO } from '../../domain/dto/user.dto';

@ObjectType()
@Entity()
export class UserModel implements UserDTO {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  password: string;

  @Field()
  @Column()
  createdAt?: Date;

  @Field()
  @Column()
  updatedAt?: Date;
}
