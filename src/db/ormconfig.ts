import path from "path";
import { ConnectionOptions } from "typeorm";
import { config } from "../config";
import { __PROD__ } from "../constants";

// TODO: Enable db caching using redis.
// TODO: Fixed configuration for testing environment.
// TODO: check if mysql migrations can be applied to sqlite
// if so, then use inmemory sqlite db while testing.
// TODO: add migration generation script in package.json
// TODO: Create seperate configuration for test.
export default {
  type: "mariadb",
  url: config.db.url,
  synchronize: !__PROD__,
  migrationsRun: true,
  entities: [path.join(__dirname, "..", "entities", "**", "*.*"), path.join(__dirname, "..", "entities", "*.*")]
} as ConnectionOptions;
