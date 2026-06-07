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

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Dhamodhara Kannan Portfolio',
      alternateName: 'DK Portfolio',
      url: 'https://dkthecoder.online',
    }),
  }],
})
</script>
