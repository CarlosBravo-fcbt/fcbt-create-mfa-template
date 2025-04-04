module.exports = {
  testEnvironment: "jsdom",
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["html-spa", "cobertura", "text"],
  collectCoverageFrom: ["!**/index.tsx"],
  coveragePathIgnorePatterns: [
    "/index\\.ts$",
    "/src/ui/jest.config.ts",
    "/coverage/",
    "/node_modules/",
    "/dist/",
    "/src/ui/webpack.config.js",
    "/src/ui/test/*",
  ],
  transform: {
    "^.+\\.[jt]sx?$": ["babel-jest"],
  },
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  clearMocks: true,
};
