runFormatTest(import.meta, ["babel"], {
  semi: false,
  singleQuote: true,
  jsxSingleQuote: true,
  arrowParens: "avoid",
  trailingComma: "none",
  printWidth: 100,
});
