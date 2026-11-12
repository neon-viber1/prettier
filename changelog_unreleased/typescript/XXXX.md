#### Fix inconsistent formatting of arrow function with conditional expression body (#NNNN by @fisker)

<!-- prettier-ignore -->
```ts
// Input
const sortByCreatedAsc: AgentSortOptionsFn = (a: AiAgent, b: AiAgent): number =>
  true ? a : b;

// Prettier stable
const sortByCreatedAsc: AgentSortOptionsFn = (
  a: AiAgent,
  b: AiAgent,
): number => (true ? a : b);

// Prettier main
const sortByCreatedAsc: AgentSortOptionsFn = (a: AiAgent, b: AiAgent): number =>
  true ? a : b;
```
