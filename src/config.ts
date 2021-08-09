import { __DEV__, __PROD__, __TEST__ } from "./constants";
import { AppConfig } from "./types/AppConfig";

export const config: AppConfig = {
  root: {
    port: Number(process.env.PORT),
    env: process.env.NODE_ENV as string
  },
  session: {
    secret: process.env.SESSION_SECRET as string
  },
  db: {
    url: process.env.DB_URL as string
  },
  redis: {
    url: process.env.REDIS_URL as string
  },
  email: {
    smtp: {
      from: process.env.SMTP_FROM as string,
      host: process.env.SMTP_HOST as string,
      port: Number(process.env.SMTP_PORT),
      username: process.env.SMTP_USERNAME as string,
      password: process.env.SMTP_PASSWORD as string
    }
  }
};
