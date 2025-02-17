<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()

const isHome = computed(() => route.path === '/')
</script>

<template>
  <div class="container" :class="{ home: isHome }">
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
$breakpoint-sm: 441px;
$breakpoint-md: 769px;
$breakpoint-lg: 1025px;
$breakpoint-xl: 1441px;

.container {
  position: relative;
  height: 100vh;
  width: 100%;
  padding: 100px 1rem 1rem;
  overflow-x: hidden;
}

.home {
  @media (min-width: $breakpoint-sm) {
    overflow: hidden;
  }
}
</style>
