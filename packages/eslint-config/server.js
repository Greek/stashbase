module.exports = {
  parser: "@babel/eslint-parser",
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: "latest",
    sourceType: "module",
    babelOptions: {
      presets: ["@babel/preset-env", "@babel/preset-typescript"],
    },
  },
  overrides: [
    {
      files: ["**/__tests__/**/*"],
      env: {
        jest: true,
      },
    },
  ],
};
