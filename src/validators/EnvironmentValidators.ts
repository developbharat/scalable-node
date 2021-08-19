import Joi from "joi";
import { BaseValidator } from "../core/BaseValidator";

const appConfigSchema = Joi.object({
  root: Joi.object({
    port: Joi.number().positive().integer().label("Application Port: PORT").required(),
    env: Joi.string().valid("production", "development", "test").label("NODE_ENV").required()
  })
    .label("Root Configuration")
    .required(),
  session: Joi.object({ secret: Joi.string().label("Session Secret: SESSION_SECRET").required() })
    .label("Session Configuration")
    .required(),
  db: Joi.object({
    url: Joi.string().label("Database URL: DB_URL").required()
  })
    .label("Database Configuration")
    .required(),
  redis: Joi.object({
    url: Joi.string().label("Redis Url: REDIS_URL").required()
  })
    .label("Redis Configuration")
    .required(),
  email: Joi.object({
    smtp: Joi.object({
      from: Joi.string().label("SMTP Sender: SMTP_FROM").required(),
      host: Joi.string().label("SMTP Host: SMTP_HOST").required(),
      port: Joi.number().integer().positive().label("SMTP Port: SMTP_PORT").required(),
      username: Joi.string().label("SMTP Username: SMTP_USERNAME").required(),
      password: Joi.string().label("SMTP Password: SMTP_PASSWORD").required()
    })
      .label("SMTP Configuration")
      .required()
  })
    .label("Email Configuration")
    .required()
});

export class EnvironmentValidators extends BaseValidator {
  public static isEnvConfigValid(env: object): boolean {
    return this.isValidJoi(appConfigSchema, env);
  }
}
