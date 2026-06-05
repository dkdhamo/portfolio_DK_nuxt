<template>
  <div class="error-page">
    <div class="error-inner text-center">
      <div class="error-code">{{ error?.statusCode || 404 }}</div>
      <div class="error-msg">{{ error?.statusCode === 500 ? 'Something went wrong.' : 'Page not found.' }}</div>
      <p class="open-sans-font mt-3">The page you are looking for doesn't exist or has been moved.</p>
      <button class="btn btn-about mt-4" @click="clearError({ redirect: '/' })">Back to Home</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ error: { statusCode?: number; message?: string } | null }>()
const { error } = toRefs(props)
</script>
