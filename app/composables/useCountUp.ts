export function useCountUp(el: Ref<HTMLElement | null>, target: Ref<number>) {
  const displayed = ref(0)

  onMounted(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return
      observer.disconnect()
      const end = target.value
      const duration = 1500
      const start = performance.now()

      function frame(now: number) {
        const progress = Math.min((now - start) / duration, 1)
        const ease = 1 - Math.pow(1 - progress, 3)
        displayed.value = Math.round(ease * end)
        if (progress < 1) requestAnimationFrame(frame)
      }
      requestAnimationFrame(frame)
    }, { threshold: 0.3 })

    if (el.value) observer.observe(el.value)
  })

  return { displayed }
}
