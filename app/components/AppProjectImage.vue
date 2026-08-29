<template>
  <!--
    Vercel's image optimizer rejects SVG, and project covers for backend work
    are hand-drawn SVGs. Serve those directly and let raster screenshots go
    through @nuxt/image as normal.
  -->
  <img
    v-if="isVector"
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="loading"
    :fetchpriority="fetchpriority"
    decoding="async"
  />
  <NuxtImg
    v-else
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="loading"
    :fetchpriority="fetchpriority"
    format="webp"
    :quality="quality"
  />
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  alt: string
  width: number
  height: number
  loading?: 'lazy' | 'eager'
  fetchpriority?: 'high' | 'low' | 'auto'
  quality?: number
}>(), {
  loading: 'lazy',
  fetchpriority: 'auto',
  quality: 80,
})

const isVector = computed(() => /\.svg(\?|$)/i.test(props.src || ''))
</script>
