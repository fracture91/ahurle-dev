module.exports = {
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  setupFilesAfterEnv: ["<rootDir>/__tests__/config/setupTests.ts"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/.next/",
    "/.history/",
    "/__tests__/.eslintrc.js",
    "/__tests__/config/",
    "/__tests__/testUtils/",
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.css$": "<rootDir>/__tests__/config/cssTransform.js",
    "^.+\\.md$": "jest-raw-loader",
    "^.+\\.mdx$": [
      "jest-transformer-mdx",
      { mdxOptions: "./config/mdxOptions" },
    ],
    "^.+\\.(jpg|jpeg|png|svg|gif|ico|webp|jp2|avif)$":
      "<rootDir>/__tests__/config/imageTransform.js",
  },
  transformIgnorePatterns: [
    "/node_modules/",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
  moduleNameMapper: {
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
  },
}
