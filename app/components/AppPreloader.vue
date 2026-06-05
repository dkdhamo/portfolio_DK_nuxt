<template>
  <div v-if="visible" class="preloader" :class="{ off: hiding }">
    <div class="black_wall"></div>
    <div class="loader"></div>
  </div>
</template>

<script setup lang="ts">
const visible = ref(true)
const hiding = ref(false)

onMounted(() => {
  const hide = () => {
    hiding.value = true
    setTimeout(() => { visible.value = false }, 600)
  }
  if (document.readyState === 'complete') {
    setTimeout(hide, 200)
  } else {
    window.addEventListener('load', hide, { once: true })
    setTimeout(hide, 2500)
  }
})
</script>
