import { Field, InputType } from "type-graphql";

@InputType()
export class SignupInput {
  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class SigninInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class ActivateUserAccountInput {
  @Field()
  email: string;

  @Field()
  code: string;
}

@InputType()
export class ResetPasswordInput {
  @Field()
  email: string;

  @Field()
  code: string;

  @Field()
  newPassword: string;
}

@InputType()
export class RequestPasswordResetEmailInput {
  @Field()
  email: string;
}

@InputType()
export class RequestAccountActivationEmailInput {
  @Field()
  email: string;
}
