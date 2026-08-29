<template>
  <footer class="site-footer open-sans-font">
    <div class="site-footer__inner">
      <span class="site-footer__identity">
        Dhamodhara Kannan <span class="site-footer__alias">— DK — dkthecoder.online</span>
      </span>
      <span class="site-footer__copy">&copy; {{ year }} Dhamodhara Kannan. All rights reserved.</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Computed once per render rather than tracked reactively — the footer
// doesn't need to update itself as the year ticks over mid-visit.
const year = new Date().getFullYear()
</script>
