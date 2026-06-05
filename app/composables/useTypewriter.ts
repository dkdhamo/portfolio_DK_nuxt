export function useTypewriter(phrases: Ref<string[]> | string[]) {
  const display = ref('')
  let phraseIdx = 0
  let charIdx = 0
  let deleting = false
  let timer: ReturnType<typeof setTimeout> | null = null

  function tick() {
    const list = isRef(phrases) ? phrases.value : phrases
    if (!list.length) return
    const current = list[phraseIdx]!

    if (!deleting) {
      display.value = current.slice(0, ++charIdx)
      if (charIdx === current.length) {
        deleting = true
        timer = setTimeout(tick, 1800)
        return
      }
    } else {
      display.value = current.slice(0, --charIdx)
      if (charIdx === 0) {
        deleting = false
        phraseIdx = (phraseIdx + 1) % list.length
      }
    }

    timer = setTimeout(tick, deleting ? 60 : 100)
  }

  onMounted(() => { timer = setTimeout(tick, 600) })
  onUnmounted(() => { if (timer) clearTimeout(timer) })

  return { display }
}
