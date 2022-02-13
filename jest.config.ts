import { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  clearMocks: true,
  testEnvironment: "node",
  moduleDirectories: ["node_modules"],
  modulePaths: ["node_modules"],
  setupFiles: ["dotenv/config"],
};
export default config;
