#### Keep inline scalar values on the same line as their key when followed by an indented comment (#XXXX by @user)

<!-- prettier-ignore -->
```yaml
# Input
a: string
  # a badly indented comment

# Prettier stable
a:
  string
  # a badly indented comment

# Prettier main
a: string
# a badly indented comment
```
