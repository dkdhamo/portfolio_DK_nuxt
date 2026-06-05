<template>
  <div class="skeleton-wrap">
    <div v-if="image" class="skeleton-image"></div>
    <div v-for="n in lines" :key="n" class="skeleton-line" :style="{ width: n === lines ? '65%' : '100%' }"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ lines?: number; image?: boolean }>()
</script>
