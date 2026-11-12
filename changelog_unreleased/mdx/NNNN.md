#### Preserve indentation of multi-line expression blocks in MDX (#NNNN)

<!-- prettier-ignore -->
```mdx
<!-- Input -->
{(() => {
  const a = 1;
  return a;
})()}

<!-- Prettier main -->
{(() => {
const a = 1;
return a;
})()}

<!-- Prettier this PR -->
{(() => {
  const a = 1;
  return a;
})()}
```
