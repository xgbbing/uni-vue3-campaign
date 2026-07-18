<template>
  <Component />
</template>

<script setup>
// 页面 proxy 底层思路
const route = getCurrentPages();
// pageRuntime.enter(route);
const Component = resolveComponent(route);
</script>
