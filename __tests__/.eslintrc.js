module.exports = {
  plugins: ["jest"],
  extends: ["plugin:jest/recommended"],
  env: {
    "jest/globals": true,
  },
  rules: {
    "jest/expect-expect": ["error", { assertFunctionNames: ["expect*"] }],
  },
}
