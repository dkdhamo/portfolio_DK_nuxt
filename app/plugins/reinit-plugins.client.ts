export default defineNuxtPlugin(() => {
  const router = useRouter()

  router.afterEach(() => {
    nextTick(() => {
      setTimeout(() => {
        const win = window as any
        // Retrigger revealator by firing scroll — it re-evaluates all
        // .revealator-* elements in the new page's DOM
        if (win.$) {
          win.$(window).trigger('scroll')
        }
        // Re-init cbpGridGallery on portfolio page
        if (win.$ && document.getElementById('grid-gallery')) {
          try { new win.CBPGridGallery(document.getElementById('grid-gallery')) } catch {}
        }
      }, 150)
    })
  })
})
