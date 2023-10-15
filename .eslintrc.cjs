/* eslint-env node */
module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
  rules: {
    semi: "error",
    "max-len": ["error", {
      code: 80,
      tabWidth: 2,
      ignoreTemplateLiterals: true,
      ignoreStrings: true
    }],
    "comma-dangle": ["error", "never"],
    "quotes": ["error"],
    "indent": ["error", 2]
  }
};
