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
      { threshold: 0.05 }
    )
    document.querySelectorAll<HTMLElement>('.reveal:not(.revealed)').forEach(el => observer!.observe(el))
  }

  onMounted(revealAll)

  const route = useRoute()
  let revealTimer: ReturnType<typeof setTimeout> | null = null
  // mode:out-in takes ~280ms for the old page to leave before new page mounts
  watch(() => route.path, () => {
    if (revealTimer) clearTimeout(revealTimer)
    revealTimer = setTimeout(revealAll, 320)
  })

  onUnmounted(() => {
    observer?.disconnect()
    if (revealTimer) clearTimeout(revealTimer)
  })
}
