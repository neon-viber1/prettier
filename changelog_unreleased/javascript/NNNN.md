#### Fix formatting of `html` templates with interpolated tag names (#NNNN by @user)

<!-- prettier-ignore -->
```js
// Input
const template = () => html`
  <${For} each=${() => this.items}>
    ${() => this.content}
  </${For}>
`;

// Prettier stable (template left unformatted)
const template = () => html`
  <${For} each=${() => this.items}>
    ${() => this.content}
  </${For}>
`;

// Prettier main
const template = () => html`
  <${For} each=${() => this.items}> ${() => this.content} </${For}>
`;
```
