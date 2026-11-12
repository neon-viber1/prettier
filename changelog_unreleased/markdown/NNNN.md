#### Fix non-idempotent formatting of HTML comments in task list items (#NNNN by @user)

<!-- prettier-ignore -->
```md
<!-- Input -->
- [ ] Foo

    <!--
      Something
    -->

<!-- Prettier stable (first format) -->
- [ ] Foo

  <!--
        Something
      -->

<!-- Prettier main -->
- [ ] Foo

  <!--
    Something
  -->
```
