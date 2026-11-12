<script setup lang="ts">
</script>

<template>
    <UTable
      v-model:pagination="(searchParams as PaginationState /* prettier-ignore */)"
      :other="(searchParams as PaginationState /* prettier-ignore */)"
      :no-parens="searchParams as PaginationState /* prettier-ignore */"
    />
</template>
