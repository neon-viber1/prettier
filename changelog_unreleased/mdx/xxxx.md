#### Keep Markdown links unbroken inside MDX JSX blocks (#XXXX by @user)

<!-- prettier-ignore -->
```mdx
<!-- Input -->
<TestComp>
  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam [nonumy eirmod tempor](https://prettier.io) invidunt ut labore.
</TestComp>

<!-- Prettier stable -->
<TestComp>
  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam [nonumy
  eirmod tempor](https://prettier.io) invidunt ut labore.
</TestComp>

<!-- Prettier main -->
<TestComp>
  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
  [nonumy eirmod tempor](https://prettier.io) invidunt ut labore.
</TestComp>
```
