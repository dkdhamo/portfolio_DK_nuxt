<template>
  <div>
    <AppPreloader />
    <AppStyleSwitcher />
    <AppHeader />
    <slot />
    <AppScrollTop />
    <AppToast />
  </div>
</template>

<script setup lang="ts">
useReveal()
</script>
