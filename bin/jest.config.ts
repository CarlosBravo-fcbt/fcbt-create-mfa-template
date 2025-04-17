import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["html-spa", "cobertura", "text"],
  collectCoverageFrom: ["!**/index.tsx"],
  coveragePathIgnorePatterns: ["/index\\.ts$", "/src/ui/jest.config.ts", "/coverage/", "/node_modules/", "/dist/", "/src/ui/webpack.config.js"],
  // transform: {
  //   "^.+\\.[jt]sx?$": ["babel-jest"],
  // },
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  clearMocks: true,
};

export default config;