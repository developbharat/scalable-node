import crypto from "crypto";
import { CustomError, GeneralStatusCodes } from "../../core/errors/CustomError";
import { SQLDatabase } from "../../db/SQLDatabase";
import { AuthTokenEntity } from "../../entities/auth/AuthTokenEntity";
import { TokenPurpose } from "../../entities/auth/TokenPurpose";
import { UserEntity } from "../../entities/auth/UserEntity";
import { send_email } from "../../utils/mailer";
import { AuthValidators } from "../../validators/AuthValidators";

const check_valid_user_by_email = async (email: string): Promise<UserEntity> => {
  if (!AuthValidators.isEmailValid(email)) throw new CustomError(GeneralStatusCodes.BadRequest, AuthValidators.error);

  const user = await SQLDatabase.conn.getRepository(UserEntity).findOne({ where: { email } });
  if (!user) throw new CustomError(GeneralStatusCodes.BadRequest, "User with provided email doesn't exist.");
  return user;
};

export const send_welcome_email = async (email: string): Promise<void> => {
  await check_valid_user_by_email(email);

  await send_email({
    to: email,
    subject: "Welcome to Develop Bharat",
    html: "Welcome user, You are most welcome in this community. You are receiving this welcome welcome because you have created account with us."
  });
};

export const send_password_reset_email = async (email: string): Promise<void> => {
  await check_valid_user_by_email(email);

  // Check if user has already generate token.
  const existingToken = await SQLDatabase.conn
    .getRepository(AuthTokenEntity)
    .findOne({ email, purpose: TokenPurpose.password_reset });
  if (!!existingToken) {
    const minutes = Math.floor((new Date().getTime() - existingToken.createdAt!.getTime()) / 1000 / 60);
    const isSpamming = minutes <= 5;

    if (isSpamming) {
      throw new CustomError(
        GeneralStatusCodes.BadRequest,
        "Your request got blocked. You will be automatically allowed to request password reset email after 5 minutes."
      );
    } else {
      await SQLDatabase.conn
        .getRepository(AuthTokenEntity)
        .delete({ email: email, purpose: TokenPurpose.password_reset });
    }
  }

  // Generate activation code
  const code = crypto.randomBytes(4).toString("hex");

  // Generate expiration time : current time + 30 minutes
  let expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + 30);
  await SQLDatabase.conn
    .getRepository(AuthTokenEntity)
    .save({ email, code: code, purpose: TokenPurpose.password_reset, expiration });

  // Send email
  await send_email({
    to: email,
    subject: "Password Reset Request",
    html: `Password reset code is ${code}. It is valid for about 30 minutes.`
  });
};

export const send_account_activation_email = async (email: string): Promise<void> => {
  const user = await check_valid_user_by_email(email);

  // Check if account is already verified.
  if (user.isEmailVerified) throw new CustomError(GeneralStatusCodes.BadRequest, "Account already activated.");

  // Check if account activation code is already requested.
  const existingToken = await SQLDatabase.conn
    .getRepository(AuthTokenEntity)
    .findOne({ email, purpose: TokenPurpose.account_activation });
  if (!!existingToken) {
    const minutes = (new Date().getTime() - existingToken.updatedAt!.getTime()) / 1000 / 60;
    const isSpamming = minutes <= 5;
    if (isSpamming) {
      throw new CustomError(
        GeneralStatusCodes.BadRequest,
        "Your request got blocked. You will be automatically allowed to request activation email after 5 minutes."
      );
    } else {
      // Delete existing token to generate a new one.
      await SQLDatabase.conn
        .getRepository(AuthTokenEntity)
        .delete({ email: email, purpose: TokenPurpose.account_activation });
    }
  }

  // Generate activation code
  const code = crypto.randomBytes(4).toString("hex");

  // Generate expiration time : current time + 30 minutes
  let expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + 30);
  await SQLDatabase.conn
    .getRepository(AuthTokenEntity)
    .save({ email, code: code, purpose: TokenPurpose.account_activation, expirationTime: expiration });

  // Send email
  await send_email({
    to: email,
    subject: "Account activation email",
    html: `Account activation code is ${code}. It is valid for about 30 minutes.`
  });
};
