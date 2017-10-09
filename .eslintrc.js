module.exports = {
  extends: ["lydell", "lydell/flowtype"],
  plugins: ["flowtype", "flowtype-errors", "prettier"],
  parser: "babel-eslint",
  env: {
    es6: true,
    node: true,
  },
  globals: {
    atom: false,
  },
  rules: {
    "flowtype-errors/show-errors": "error",
    "flowtype/require-valid-file-annotation": [
      "error",
      "always",
      // Atom seems to only allow block style to detect Flow.
      { annotationStyle: "block" },
    ],
    "prettier/prettier": "error",
  },
  overrides: [
    {
      files: [".*.js", "*.config.js"],
      rules: {
        "flowtype/require-valid-file-annotation": "off",
      },
    },
  ],
};
