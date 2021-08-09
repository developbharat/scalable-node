import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  maxWorkers: "50%",
  passWithNoTests: false,
  modulePathIgnorePatterns: ["dist/", "src"]
};

export default config;
