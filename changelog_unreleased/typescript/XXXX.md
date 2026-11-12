#### Fix inconsistent formatting of nested call with arrow function argument in variable declaration (#NNNN by @fisker)

<!-- prettier-ignore -->
```tsx
// Input
const x = xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx()((props: xxxxxxxxxxxxx) => {
  //
});

// Prettier stable
const x = xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx()((
  props: xxxxxxxxxxxxx,
) => {
  //
});

// Prettier main
const x = xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx()(
  (props: xxxxxxxxxxxxx) => {
    //
  },
);
```
