import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../../../models/User";
import * as authService from "../../../services/auth/auth.service";
import * as mailerService from "../../../services/emails/auth.emails.service";
import {
  ActivateUserAccountInput,
  RequestAccountActivationEmailInput,
  RequestPasswordResetEmailInput,
  ResetPasswordInput,
  SigninInput,
  SignupInput
} from "./auth.inputs";

@Resolver()
export class AuthResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: ExpressContext): Promise<User | undefined> {
    if (req.session.user) return User.parse(req.session.user);
    return undefined;
  }

  @Mutation(() => User)
  async signin(@Arg("options") options: SigninInput, @Ctx() { req }: ExpressContext): Promise<User> {
    const user = await authService.signin(options);
    req.session.user = user;
    return user;
  }

  @Mutation(() => User)
  async signup(@Arg("options") options: SignupInput): Promise<User> {
    const user = await authService.signup(options);
    return user;
  }

  @Mutation(() => User)
  async activateUserAccount(@Arg("options") options: ActivateUserAccountInput): Promise<User> {
    const user = await authService.activate_user_account(options);
    return user;
  }

  @Mutation(() => Boolean)
  async resetUserPassword(@Arg("options") options: ResetPasswordInput) {
    await authService.reset_user_password(options);
    return true;
  }

  @Mutation(() => Boolean, { nullable: true })
  async logout(@Ctx() { req, res }: ExpressContext): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) reject(err);
        res.clearCookie("qid");
        return resolve();
      });
    });
  }

  @Mutation(() => Boolean, { nullable: true })
  async requestAccountActivationEmail(@Arg("options") options: RequestAccountActivationEmailInput): Promise<void> {
    await mailerService.send_account_activation_email(options.email);
  }

  @Mutation(() => Boolean, { nullable: true })
  async requestPasswordResetEmail(@Arg("options") options: RequestPasswordResetEmailInput): Promise<void> {
    await mailerService.send_password_reset_email(options.email);
  }
}
