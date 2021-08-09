import { logger } from "../../utils/logger";
import * as mailerService from "../../services/emails/auth.emails.service";
import {
  AccountActivationEvents,
  AuthEmitter,
  ResetPasswordEvents,
  SigninEvents,
  SignupEvents
} from "../emitters/AuthEmitter";
import * as mailer from "../../utils/mailer";

// TODO: log user activity to table. - yet not created db table

AuthEmitter.on(SigninEvents.Success, (user) => {
  // User just logged in,
  // You might want to keep track of recent logins.
  logger.info("User just logged in: ", user);
});

AuthEmitter.on(SigninEvents.UnverifiedEmail, async (user) => {
  // User tried to login with unverified email
  // Send him a email with account verification instructions
  // or something similar to support him.
  await mailerService.send_account_activation_email(user.email);
  await mailer.send_email({
    to: user.email,
    subject: "Account Login with Unverified Account",
    html: "It looks like you tried to login with unverified account. In case you want to activate your account, please activate it via account activation email sent to you just now."
  });
  logger.info("User has unverified account: ", user);
});

AuthEmitter.on(SigninEvents.InvalidPassword, (user) => {
  // Someone tried to access this account.
  // You can verify by email if he/she is user or intruder.
  logger.info("Invalid credentials provided by the user: ", user);
});

AuthEmitter.on(SignupEvents.Success, async (user) => {
  // User has successfully created account on our website.
  // Send him a account verification email and a welcome email.
  await mailerService.send_account_activation_email(user.email);
  await mailerService.send_welcome_email(user.email);
  logger.info("Account created successful by:", user);
});

AuthEmitter.on(SignupEvents.DuplicateEmail, async (user) => {
  // User is trying to create new account with existing email,
  // Send him a email to support him with password reset instructions
  // or asking him to signin.
  await mailer.send_email({
    to: user.email,
    subject: "Account already exists.",
    html: "It looks like you tried to create account with existing email address, please try to login or reset password in case you want to recover credentials"
  });
  logger.info("Account with provided email already exists for user:", user);
});

AuthEmitter.on(AccountActivationEvents.Success, async (user) => {
  // User has successfully completed account activation
  // You might send him a greetings email.

  await mailer.send_email({
    to: user.email,
    subject: "Activation Successful.",
    html: "Your account activated successfully. You are now allowed to use our services fully. You can contact us any time for any query. We are here to help you. Thanks and enjoy your experience with our services."
  });
  logger.info("Account activated successfully: ", user);
});

AuthEmitter.on(AccountActivationEvents.InvalidToken, (user) => {
  // User tried to activate account with invalid token.
  // You might send him a new token or
  // send a notification that he is trying to activate account with invalid token.
  logger.info("Invalid account activation token received: ", user);
});

AuthEmitter.on(AccountActivationEvents.TokenExpired, (user) => {
  // User tried to activate account with expired token.
  // You might send him a new token or
  // send a notification that he is trying to activate account with expired token.
  logger.info("account activation token expired: ", user);
});

AuthEmitter.on(AccountActivationEvents.TokenNotRequested, (user) => {
  // User hasn't yet requested token from our service.
  // You might send him a support email or
  // Check if he has already activated account.
  logger.info("account activation token not requested: ", user);
});

AuthEmitter.on(ResetPasswordEvents.Success, (user) => {
  // User has successfully completed account recovery
  // You might send him a greetings email.
  logger.info("Account password reseted successfully: ", user);
});

AuthEmitter.on(ResetPasswordEvents.InvalidToken, async (user) => {
  // User tried to reset password with invalid token.
  // You might send him a new token or
  // send a notification that he is trying to reset password with invalid token.
  await mailer.send_email({
    to: user.email,
    subject: "Password reset successful.",
    html: "Password has been reset successfully. You can now login with new credentials."
  });
  logger.info("Invalid password reset token received: ", user);
});

AuthEmitter.on(ResetPasswordEvents.TokenExpired, (user) => {
  // User tried to reset password with expired token.
  // You might send him a new token or
  // send a notification that he is trying to reset password with expired token.
  logger.info("password reset token expired: ", user);
});

AuthEmitter.on(ResetPasswordEvents.TokenNotRequested, (user) => {
  // User hasn't yet requested token from our service.
  // You might send him a support email
  logger.info("password reset token not requested: ", user);
});
