<template>
  <div>
    <AppStyleSwitcher />
    <AppHeader />
    <slot />
  </div>
</template>

<script setup lang="ts">
useHead({
  script: [
    { src: '/js/jquery-3.5.0.min.js', tagPosition: 'bodyClose' },
    { src: '/js/styleswitcher.js', tagPosition: 'bodyClose' },
    { src: '/js/preloader.min.js', tagPosition: 'bodyClose' },
    { src: '/js/fm.revealator.jquery.min.js', tagPosition: 'bodyClose' },
    { src: '/js/imagesloaded.pkgd.min.js', tagPosition: 'bodyClose' },
    { src: '/js/masonry.pkgd.min.js', tagPosition: 'bodyClose' },
    { src: '/js/classie.js', tagPosition: 'bodyClose' },
    { src: '/js/cbpGridGallery.js', tagPosition: 'bodyClose' },
    { src: '/js/jquery.hoverdir.js', tagPosition: 'bodyClose' },
    { src: '/js/popper.min.js', tagPosition: 'bodyClose' },
    { src: '/js/bootstrap.js', tagPosition: 'bodyClose' },
    { src: '/js/custom.js', tagPosition: 'bodyClose' },
  ],
})
</script>
