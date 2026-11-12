#### Break single-line type literals containing JSDoc comments (#NNNN by @user)

TypeScript only recognizes a JSDoc comment when it starts on a new line, so type literals with JSDoc comments on members are now printed on multiple lines.

<!-- prettier-ignore -->
```ts
// Input
type A = { /** a */ a: 0 };

// Prettier stable
type A = { /** a */ a: 0 };

// Prettier main
type A = {
  /** a */
  a: 0;
};
```
