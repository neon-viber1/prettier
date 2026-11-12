#### Respect `/* prettier-ignore */` in parenthesized Vue TypeScript expressions (#NNNN by @user)

<!-- prettier-ignore -->
```vue
<!-- Input -->
<script setup lang="ts"></script>

<template>
  <UTable
    v-model:pagination="(searchParams as PaginationState /* prettier-ignore */)"
  />
</template>

<!-- Prettier stable -->
<script setup lang="ts"></script>

<template>
  <UTable
    v-model:pagination="searchParams as PaginationState /* prettier-ignore */"
  />
</template>

<!-- Prettier main -->
<script setup lang="ts"></script>

<template>
  <UTable
    v-model:pagination="(searchParams as PaginationState /* prettier-ignore */)"
  />
</template>
```
