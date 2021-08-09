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
  await check_valid_user_by_email(email);

  // Generate activation code
  const code = crypto.randomBytes(4).toString("hex");

  // Generate expiration time : current time + 30 minutes
  let expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + 30);
  await SQLDatabase.conn
    .getRepository(AuthTokenEntity)
    .save({ email, code: code, purpose: TokenPurpose.signup_account_activation, expiration });

  // Send email
  await send_email({
    to: email,
    subject: "Account activation email",
    html: `Account activation code is ${code}. It is valid for about 30 minutes.`
  });
};
