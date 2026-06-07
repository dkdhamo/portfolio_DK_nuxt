export function useReveal() {
  if (!import.meta.client) return

  let observer: IntersectionObserver | null = null

  function revealAll() {
    observer?.disconnect()
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer!.unobserve(entry.target)
          }
        })
      },
      { threshold: 0 }
    )
    document.querySelectorAll<HTMLElement>('.reveal:not(.revealed)').forEach(el => observer!.observe(el))
  }

  function forceRevealAll() {
    observer?.disconnect()
    document.querySelectorAll<HTMLElement>('.reveal:not(.revealed)').forEach(el => {
      el.classList.add('revealed')
    })
  }

  onMounted(revealAll)

  const route = useRoute()
  let revealTimer: ReturnType<typeof setTimeout> | null = null
  let fallbackTimer: ReturnType<typeof setTimeout> | null = null

  // mode:out-in takes ~280ms for the old page to leave before new page mounts
  watch(() => route.path, () => {
    if (revealTimer) clearTimeout(revealTimer)
    if (fallbackTimer) clearTimeout(fallbackTimer)
    revealTimer = setTimeout(revealAll, 320)
    // Force-reveal anything the observer missed after the full transition (280ms out + 280ms in)
    fallbackTimer = setTimeout(forceRevealAll, 650)
  })

  onUnmounted(() => {
    observer?.disconnect()
    if (revealTimer) clearTimeout(revealTimer)
    if (fallbackTimer) clearTimeout(fallbackTimer)
  })
}
