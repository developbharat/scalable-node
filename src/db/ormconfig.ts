import path from "path";
import { ConnectionOptions } from "typeorm";
import { config } from "../config";
import { __DEV__, __PROD__, __TEST__ } from "../constants";

// TODO: Enable db caching using redis.
export default {
  name: "default",
  type: "mariadb",
  url: config.db.url,
  synchronize: __DEV__,
  migrationsRun: true,
  dropSchema: __TEST__,
  entities: [path.join(__dirname, "..", "entities", "**", "*.*"), path.join(__dirname, "..", "entities", "*.*")],
  migrations: [path.join(__dirname, "migrations", "*.*")],
  cli: {
    entitiesDir: path.join(__dirname, "..", "entities"),
    migrationsDir: path.join(__dirname, "migrations")
  }
} as ConnectionOptions;
