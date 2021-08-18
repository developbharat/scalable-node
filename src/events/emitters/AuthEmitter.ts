import { EventEmitter } from "events";
import TypedEmitter from "typed-emitter";
import { User } from "../../models/User";

export enum CommonAuthEvents {
  AccountBlocked = "ACCOUNT_BLOCKED",
  InActiveAccount = "ACCOUNT_INACTIVE"
}

export enum SigninEvents {
  Success = "USER_SIGNIN_SUCCESS",
  InvalidPassword = "USER_SIGNIN_FAILURE__INVALID_PASSWORD"
}

export enum SignupEvents {
  Success = "USER_SIGNUP_SUCCESS",
  DuplicateEmail = "USER_SIGNUP_FAILURE__DUPLICATE_EMAIL"
}

export enum AccountActivationEvents {
  Success = "ACCOUNT_ACTIVATION_SUCCESS",
  TokenExpired = "ACCOUNT_ACTIVATION_FAILURE__TOKEN_EXPIRED",
  TokenNotRequested = "ACCOUNT_ACTIVATION_FAILURE__TOKEN_NOT_REQUESTED",
  InvalidToken = "ACCOUNT_ACTIVATION_FAILURE__TOKEN_INVALID"
}

export enum ResetPasswordEvents {
  Success = "RESET_PASSWORD_SUCCESS",
  TokenExpired = "RESET_PASSWORD_FAILURE__TOKEN_EXPIRED",
  TokenNotRequested = "RESET_PASSWORD_FAILURE__TOKEN_NOT_REQUESTED",
  InvalidToken = "RESET_PASSWORD_FAILURE__TOKEN_INVALID"
}

type IUser = (user: User) => void;

export type AuthEvents = {
  [key in CommonAuthEvents | SigninEvents | SignupEvents | AccountActivationEvents | ResetPasswordEvents]: IUser;
};

class AuthEventsEmitter extends EventEmitter {}

export const AuthEmitter = new AuthEventsEmitter() as TypedEmitter<AuthEvents>;
