import path from "path";
import { ConnectionOptions } from "typeorm";
import { config } from "../config";
import { __PROD__ } from "../constants";

// TODO: Enable db caching using redis.
export default {
  name: "default",
  type: "mariadb",
  url: config.db.url,
  synchronize: !__PROD__,
  migrationsRun: true,
  entities: [path.join(__dirname, "..", "entities", "**", "*.*"), path.join(__dirname, "..", "entities", "*.*")]
} as ConnectionOptions;
