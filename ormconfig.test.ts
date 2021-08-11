import path from "path";
import { ConnectionOptions } from "typeorm";

export default {
  type: "mariadb",
  url: "mariadb://test:password@localhost:3306/formstation_test",
  synchronize: false,
  migrationsRun: true,
  entities: [path.join(__dirname, "src", "entities", "**", "*.*"), path.join(__dirname, "src", "entities", "*.*")],
  cli: {
    entitiesDir: path.join(__dirname, "src", "db", "entities"),
    migrationsDir: path.join(__dirname, "src", "db", "migrations")
  }
} as ConnectionOptions;
