module.exports = {
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    testEnvironment: "node",
    testRegex: ".*(_spec.ts|.spec.ts|_spec.js|.spec.js)",
    testPathIgnorePatterns: ["/node_modules/"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    "coverageThreshold": {
        "global": {
          "branches": 66,
          "functions": 94,
          "lines": 94,
          "statements": 93
        }
    },
    collectCoverageFrom: [
        "**/*.{ts,tsx}",
        "!**/*_spec*",
        "!**/*aModuleToMock.ts",
        "!**/*.config.*",
        "!**/build/**",
        "!**/coverage",
        "!**/serverless",
        "!**/node_modules/**",
        "!**/vendor/**"
    ]
};