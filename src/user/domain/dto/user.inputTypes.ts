import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class AuthUserInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class AuthUserResponse {
  @Field()
  email: string;

  @Field()
  accessToken: string;
}

@ObjectType()
export class getAllUserResponse {
  @Field(() => String)
  email: string;

  @Field(() => String)
  id: string;
}

@InputType()
export class getSingleUserInput {
  @Field()
  email: string;
}
