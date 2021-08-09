import argon2 from "argon2";
import { AuthError, AuthStatusCodes } from "../../core/errors/CustomError";
import { SQLDatabase } from "../../db/SQLDatabase";
import { AuthTokenEntity } from "../../entities/auth/AuthTokenEntity";
import { TokenPurpose } from "../../entities/auth/TokenPurpose";
import { UserEntity } from "../../entities/auth/UserEntity";
import {
  AccountActivationEvents,
  AuthEmitter,
  ResetPasswordEvents,
  SigninEvents,
  SignupEvents
} from "../../events/emitters/AuthEmitter";
import { User } from "../../models/User";
import { ActivateAccountOptions, ResetPasswordOptions, SigninOptions, SignupOptions } from "../../types/auth";
import { AuthValidators } from "../../validators/AuthValidators";

export const signin = async (options: SigninOptions): Promise<User> => {
  const { email, password } = options;

  if (!AuthValidators.isEmailValid(email))
    throw new AuthError(AuthStatusCodes.InvalidCredentials, AuthValidators.error);

  const user = await SQLDatabase.conn.getRepository(UserEntity).findOne({ email: email });
  if (!!!user) throw new AuthError(AuthStatusCodes.InvalidCredentials, "Account with provided email doesn't exist.");

  if (!user.isEmailVerified) {
    AuthEmitter.emit(SigninEvents.UnverifiedEmail, User.fromEntity(user));
    throw new AuthError(
      AuthStatusCodes.UnAuthorized,
      "Your email address has not been verified, please verify your email to signin."
    );
  }

  const isPasswordValid = await argon2.verify(user.password, password);
  if (!isPasswordValid) {
    AuthEmitter.emit(SigninEvents.InvalidPassword, User.fromEntity(user));
    throw new AuthError(AuthStatusCodes.InvalidCredentials, "Invalid credentials provided.");
  }

  AuthEmitter.emit(SigninEvents.Success, User.fromEntity(user));
  return User.fromEntity(user);
};

export const signup = async (options: SignupOptions): Promise<User> => {
  const { firstname, lastname, email, password } = options;

  if (
    !AuthValidators.isEmailValid(email) ||
    !AuthValidators.isPasswordValid(password) ||
    !AuthValidators.isFirstnameValid(firstname) ||
    !AuthValidators.isLastnameValid(lastname)
  ) {
    throw new AuthError(AuthStatusCodes.InvalidCredentials, AuthValidators.error);
  }

  const exists = await SQLDatabase.conn.getRepository(UserEntity).findOne({ email: email });
  if (!!exists) {
    AuthEmitter.emit(SignupEvents.DuplicateEmail, User.fromEntity(exists));
    throw new AuthError(AuthStatusCodes.InvalidCredentials, "User with provided email already exists.");
  }

  const hashedPassword = await argon2.hash(password);
  const user = await SQLDatabase.conn.getRepository(UserEntity).save({
    firstname,
    lastname,
    email,
    password: hashedPassword
  });

  AuthEmitter.emit(SignupEvents.Success, User.fromEntity(user));
  return User.fromEntity(user);
};

export const activate_user_account = async (options: ActivateAccountOptions): Promise<User> => {
  const { email, code } = options;
  if (!AuthValidators.isEmailValid(email))
    throw new AuthError(AuthStatusCodes.InvalidCredentials, AuthValidators.error);

  const user = await SQLDatabase.conn.getRepository(UserEntity).findOne({ email });
  if (!user) throw new AuthError(AuthStatusCodes.InvalidCredentials, "User with provided email doesn't exist.");

  const token = await SQLDatabase.conn.getRepository(AuthTokenEntity).findOne({
    email,
    purpose: TokenPurpose.signup_account_activation
  });
  if (!token) {
    AuthEmitter.emit(AccountActivationEvents.TokenNotRequested, User.fromEntity(user));
    throw new AuthError(AuthStatusCodes.InvalidCredentials, "Token expired.");
  }

  const isExpired = !token?.expirationTime || new Date().getTime() > token.expirationTime.getTime();
  if (isExpired) {
    AuthEmitter.emit(AccountActivationEvents.InvalidToken, User.fromEntity(user));
    throw new AuthError(AuthStatusCodes.InvalidCredentials, "Token expired.");
  }

  const isTokenCodeValid = code && token?.code && code === token.code;
  if (!isTokenCodeValid) {
    AuthEmitter.emit(AccountActivationEvents.TokenExpired, User.fromEntity(user));
    throw new AuthError(AuthStatusCodes.InvalidCredentials, "Invalid token code provided.");
  }

  // Activate account and delete token
  await SQLDatabase.conn.getRepository(UserEntity).update({ id: user.id }, { isEmailVerified: true });
  await SQLDatabase.conn.getRepository(AuthTokenEntity).delete({ id: token.id });

  AuthEmitter.emit(AccountActivationEvents.Success, User.fromEntity(user));
  return User.fromEntity(user);
};

export const reset_user_password = async (options: ResetPasswordOptions): Promise<User> => {
  const { email, code, newPassword } = options;
  if (!AuthValidators.isEmailValid(email) || !AuthValidators.isPasswordValid(newPassword))
    throw new AuthError(AuthStatusCodes.InvalidCredentials, AuthValidators.error);

  const user = await SQLDatabase.conn.getRepository(UserEntity).findOne({ email });
  if (!user) throw new AuthError(AuthStatusCodes.InvalidCredentials, "User with provided email doesn't exist.");

  const token = await SQLDatabase.conn.getRepository(AuthTokenEntity).findOne({
    email,
    purpose: TokenPurpose.password_reset
  });

  if (!token) {
    AuthEmitter.emit(ResetPasswordEvents.TokenNotRequested, User.fromEntity(user));
    throw new AuthError(AuthStatusCodes.InvalidCredentials, "Token expired.");
  }

  const isExpired = !token?.expirationTime || new Date().getTime() > token.expirationTime.getTime();
  if (isExpired) {
    AuthEmitter.emit(ResetPasswordEvents.InvalidToken, User.fromEntity(user));
    throw new AuthError(AuthStatusCodes.InvalidCredentials, "Token expired.");
  }

  const isTokenCodeValid = code && token?.code && code === token.code;
  if (!isTokenCodeValid) {
    AuthEmitter.emit(AccountActivationEvents.TokenExpired, User.fromEntity(user));
    throw new AuthError(AuthStatusCodes.InvalidCredentials, "Invalid token code provided.");
  }

  // Delete the token, so it cannot be used again.
  await SQLDatabase.conn.getRepository(AuthTokenEntity).delete({ id: token.id });

  const hashedPassword = await argon2.hash(newPassword);
  await SQLDatabase.conn.getRepository(UserEntity).update({ id: user.id }, { password: hashedPassword });

  return User.fromEntity(user);
};

// TODO: implement below methods for sending account activation and password reset emails.

/* 
export const send_email_confirmation_code = async (email: string): Promise<User> => {
  if (!AuthValidators.isEmailValid(email)) throw new Error(AuthValidators.error);

  const user = await SQLDatabase.userRepo.findOne({ email });
  if (!user) throw new Error("User with provided email doesn't exist.");

  if (user.isEmailVerified) {
    AuthEmitter.emit("SEND_EMAIL_CONFIRMATION_CODE_FAILURE__ALREADY_VERIFIED", User.fromEntity(user));
    throw new Error("User account with provided email is already verified.");
  }

  // Generate activation code
  const code = crypto.randomBytes(4).toString("hex");

  // Generate expiration time : current time + 30 minutes
  let expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + 30);

  // Check if user has already generated a password reset code.
  const existingCode = await SQLDatabase.verifyTokenRepo.findOne({ email, isEmailConfirmation: true });
  if (!!existingCode) {
    await SQLDatabase.verifyTokenRepo.update(
      {
        email
      },
      {
        code: code,
        expirationTime: `${expiration.getTime()}`
      }
    );
  } else {
    await SQLDatabase.verifyTokenRepo.save({
      email,
      isEmailConfirmation: true,
      code: code,
      expirationTime: `${expiration.getTime()}`
    });
  }
  // Send email
  const htmlEmailContent = await prepare_account_activation_email(User.fromEntity(user), code);
  await mailer.send_email({ to: user.email, subject: "Welcome to Torlases", html: htmlEmailContent });

  AuthEmitter.emit("SEND_EMAIL_CONFIRMATION_CODE_SUCCESS", User.fromEntity(user));
  return User.fromEntity(user);
};

export const send_reset_password_code = async (email: string): Promise<User> => {
  if (!AuthValidators.isEmailValid(email)) throw new Error(AuthValidators.error);

  const user = await SQLDatabase.userRepo.findOne({ email });
  if (!user) throw new Error("User with provided email doesn't exist.");

  // Generate activation code
  const code = crypto.randomBytes(4).toString("hex");

  // Generate expiration time : current time + 30 minutes
  let expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + 30);

  // Check if user has already generated a password reset code.
  const existingCode = await SQLDatabase.verifyTokenRepo.findOne({ email, isResetPassword: true });
  if (!!existingCode) {
    await SQLDatabase.verifyTokenRepo.update(
      {
        email
      },
      {
        code: code,
        expirationTime: `${expiration.getTime()}`
      }
    );
  } else {
    await SQLDatabase.verifyTokenRepo.save({
      email,
      isResetPassword: true,
      code: code,
      expirationTime: `${expiration.getTime()}`
    });
  }

  // Send email
  const htmlEmailContent = prepare_password_reset_email(User.fromEntity(user), code);
  await mailer.send_email({ to: user.email, subject: "Reset your password", html: htmlEmailContent });

  AuthEmitter.emit("SEND_RESET_PASSWORD_CODE_SUCCESS", User.fromEntity(user));
  return User.fromEntity(user);
};

*/
