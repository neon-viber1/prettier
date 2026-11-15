#### Respect `--object-wrap=preserve` for type literal in the sole function parameter (#NNNN by @user)

<!-- prettier-ignore -->
```ts
// Input
function main(options:{
  a:number,b:number}) {
  return null
}

// Prettier stable
function main(options: { a: number; b: number }) {
  return null;
}

// Prettier main
function main(options: {
  a: number;
  b: number;
}) {
  return null;
}
```
