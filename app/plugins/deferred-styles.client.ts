// Load non-critical CSS after first paint to eliminate render-blocking
// font-awesome: icon fonts — not needed for layout, can load after paint
export default defineNuxtPlugin(() => {
  const sheets = [
    '/css/font-awesome.min.css',
  ]

  function loadSheet(href: string) {
    if (document.querySelector(`link[href="${href}"]`)) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    document.head.appendChild(link)
  }

  if (document.readyState === 'complete') {
    sheets.forEach(loadSheet)
  } else {
    window.addEventListener('load', () => sheets.forEach(loadSheet), { once: true })
  }
})
