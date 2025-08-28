export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(jpg|jpeg|png|gif|webp|svg|css|less|sass|scss)$":
      "<rootDir>/__mocks__/fileMock.js",
  },
  transform: {
    "^.+\\.(js|jsx|mjs|cjs|ts|tsx)$": "babel-jest",
    "^.+\\.jsx?$": "babel-jest",
  },
};
