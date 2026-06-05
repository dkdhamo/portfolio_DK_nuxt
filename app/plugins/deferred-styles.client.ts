// Load non-critical CSS after first paint to eliminate render-blocking
// font-awesome: icon fonts — not needed for layout, can load after paint
// circle.css: only used on /about skill circles — not needed for first paint
export default defineNuxtPlugin(() => {
  const sheets = [
    '/css/font-awesome.min.css',
    '/css/circle.css',
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
