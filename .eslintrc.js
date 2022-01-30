module.exports = {
  "root": true,
  "env": {
    "node": true,
    "es6": true
  },
  "extends": "eslint:recommended",
  "rules": {
    "indent": ["error", 2,],
    "semi": ["error", "always"],
    "comma-dangle": ["error", "never"],

    "no-constant-condition": ["error"], // Unexpected constant condition
    "no-undef": ["error"], // '...' is not defined
    "no-unreachable": ["error"], // Unreachable code
    "valid-typeof": ["error"], // Invalid typeof comparison value

    "no-console": ["error"],
    "no-empty": ["error"], // Empty block statement
    "no-octal": ["error"], // Octal literals should not be used
    "no-redeclare": ["error"], // '...' is already defined
    "no-unused-vars": ["error"], // '...' is assigned a value but never used
    "semi": ["error"], // Missing semicolon
  }
};
