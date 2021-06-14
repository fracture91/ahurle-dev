module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "next",
    "plugin:react/recommended",
    "airbnb",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:eslint-comments/recommended",
    "plugin:mdx/recommended",
  ],
  reportUnusedDisableDirectives: true, // pair with --max-warnings=0
  ignorePatterns: ["node_modules/*", ".next/*", "out/*", "vendor/*"],
  overrides: [
    {
      files: "*.{ts,tsx}",
      parser: "@typescript-eslint/parser",
      rules: {
        // the non-typescript rules are too dumb, false positives
        "no-undef": "off",
        "no-unused-vars": "off",
        "no-shadow": "off",
      },
    },
    {
      files: "*.{js,jsx}",
      rules: {
        // If I'm using JS it's probably in a config file that doesn't support ES modules
        "@typescript-eslint/no-var-requires": "off",
      },
    },
    {
      files: "*.mdx",
      globals: {
        layoutProps: "readonly",
        props: "readonly",
      },
      rules: {
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@next/next/no-img-element": "off",
      },
    },
  ],
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
    "lines-between-class-members": [
      "error",
      "always",
      { exceptAfterSingleLine: true },
    ],
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
    "jsx-a11y/alt-text": ["error", { img: ["Image", "LazyImage"] }],
    "react/react-in-jsx-scope": "off", // next.js uses new JSX transform by default
    "react/prop-types": "off", // use types instead
    "react/jsx-filename-extension": [
      "error",
      { extensions: [".jsx", ".tsx", ".mdx"] },
    ],
    "react/jsx-pascal-case": "off", // does not like Themed.h1 from theme-ui
    "react/jsx-props-no-spreading": "off", // very annoying with recommended theme-ui props passing
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
    "no-use-before-define": "off", // must disable in favor of next rule
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-use-before-define": ["error"],
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/ban-ts-comment": [
      "error",
      { "ts-ignore": "allow-with-description" },
    ],
    "eslint-comments/disable-enable-pair": ["error", { allowWholeFile: true }],
  },
  settings: {
    // "mdx/code-blocks": true,
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      alias: {
        map: [["@", "."]],
        extensions: [".js", ".jsx", ".ts", ".tsx", ".mdx"],
      },
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".mdx"],
      },
      typescript: { alwaysTryTypes: true },
    },
  },
}
