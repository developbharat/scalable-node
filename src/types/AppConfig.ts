export type AppConfig = {
  root: {
    port: number;
    env: string;
  };
  session: {
    secret: string;
  };
  db: {
    url: string;
  };
  redis: {
    url: string;
  };
  email: {
    smtp: {
      from: string;
      host: string;
      port: number;
      username: string;
      password: string;
    };
  };
};
