module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "plugin:react/recommended",
    "airbnb",
    "prettier",
    "prettier/@typescript-eslint",
    "prettier/react",
    "plugin:eslint-comments/recommended",
  ],
  reportUnusedDisableDirectives: true, // pair with --max-warnings=0
  ignorePatterns: ["node_modules/*", ".next/*", ".out/*"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "react-hooks", "@typescript-eslint"],
  rules: {
    quotes: ["error", "double", { avoidEscape: true }],
    semi: ["error", "never"],
    "no-restricted-imports": ["error", { patterns: ["../*"] }],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "import/prefer-default-export": "off",
    "react/react-in-jsx-scope": "off", // next.js uses new JSX transform by default
    "react/prop-types": "off", // use types instead
    "react/jsx-filename-extension": ["error", { extensions: [".jsx", ".tsx"] }],
    "react/jsx-pascal-case": "off", // does not like Themed.h1 from theme-ui
    "react/jsx-props-no-spreading": "off", // very annoying with recommended theme-ui props passing
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
    "no-use-before-define": "off", // must disable in favor of next rule
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-use-before-define": ["error"],
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "eslint-comments/disable-enable-pair": ["error", { allowWholeFile: true }],
  },
  settings: {
    "import/resolver": {
      alias: {
        map: [
          ["helpers", "./helpers"],
          ["components", "./components"],
          ["pages", "./pages"],
          ["styles", "./styles"],
        ],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
}
