<template>
  <div>
    <AppPreloader />
    <AppHeader />
    <slot />
    <AppFooter />
    <AppScrollTop />
    <AppToast />
  </div>
</template>

<script setup lang="ts">
useReveal()

</script>
