/**
 * First-party page/click tracking.
 *
 * Everything read here is available to any script on the page with no
 * permission prompt — screen size, language, timezone, hardware hints. The
 * things that *would* prompt (navigator.geolocation, camera, mic, clipboard,
 * notifications) are deliberately not touched.
 *
 * Sends are fire-and-forget: analytics must never delay navigation or throw
 * into the page.
 */
export default defineNuxtPlugin(() => {
  const router = useRouter()

  function env() {
    const nav = navigator as Navigator & {
      connection?: { effectiveType?: string }
      deviceMemory?: number
    }
    const url = new URL(window.location.href)

    return {
      referrer: document.referrer || '',
      utmSource: url.searchParams.get('utm_source') || '',
      utmMedium: url.searchParams.get('utm_medium') || '',
      utmCampaign: url.searchParams.get('utm_campaign') || '',
      screenWidth: window.screen?.width ?? null,
      screenHeight: window.screen?.height ?? null,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      pixelRatio: window.devicePixelRatio ?? null,
      language: navigator.language || '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
      colorScheme: window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      connection: nav.connection?.effectiveType || '',
      cpuCores: nav.hardwareConcurrency ?? null,
      deviceMemory: nav.deviceMemory ?? null,
      touchPoints: nav.maxTouchPoints ?? null,
    }
  }

  /** Real load time for this visitor, once the browser has the timing. */
  function loadTimeMs(): number | null {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    if (!nav || !nav.loadEventEnd) return null
    return Math.round(nav.loadEventEnd - nav.startTime)
  }

  function send(payload: Record<string, unknown>) {
    const body = JSON.stringify({ ...env(), ...payload })
    try {
      // sendBeacon survives the page being torn down mid-navigation, which
      // fetch() does not — important for outbound-link clicks.
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }))
        return
      }
    } catch {
      // fall through to fetch
    }
    fetch('/api/track', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {})
  }

  function trackPageview(path: string) {
    // Wait for load so loadTimeMs is populated on the first view.
    if (document.readyState === 'complete') {
      send({ eventType: 'pageview', path, loadTimeMs: loadTimeMs() })
    } else {
      window.addEventListener(
        'load',
        () => send({ eventType: 'pageview', path, loadTimeMs: loadTimeMs() }),
        { once: true },
      )
    }
  }

  /** Work out what a click means, or null if it isn't worth recording. */
  function classify(el: HTMLElement): string | null {
    const explicit = el.closest<HTMLElement>('[data-track]')
    if (explicit) return explicit.dataset.track || null

    const link = el.closest('a')
    if (!link) return null

    const href = link.getAttribute('href') || ''
    if (!href || href.startsWith('#')) return null

    if (/\.pdf($|\?)/i.test(href) || href.includes('/assets/resume/')) return 'cv_download'
    if (href.startsWith('mailto:')) return 'email_click'
    if (href.startsWith('tel:')) return 'phone_click'

    if (/^https?:\/\//i.test(href)) {
      try {
        const host = new URL(href).hostname.replace(/^www\./, '')
        if (host === window.location.hostname.replace(/^www\./, '')) return null
        return `outbound:${host}`
      } catch {
        return null
      }
    }
    return null
  }

  const path = () => window.location.pathname
  const isAdmin = (p: string) => p === '/admin' || p.startsWith('/admin/')

  // The admin panel is mine, not audience traffic.
  if (!isAdmin(path())) trackPageview(path())

  // router.afterEach also fires for the initial route during hydration, which
  // would double-count the very first view of every visit — the entry above
  // already recorded it (and carries the load timing). Only report genuine
  // client-side navigations after that.
  let initialNavigationSeen = false

  router.afterEach((to) => {
    if (!initialNavigationSeen) {
      initialNavigationSeen = true
      return
    }
    if (isAdmin(to.path)) return
    // Let the new page commit before recording it.
    nextTick(() => send({ eventType: 'pageview', path: to.path }))
  })

  document.addEventListener(
    'click',
    (e) => {
      if (isAdmin(path())) return
      const el = e.target as HTMLElement | null
      if (!el) return
      const target = classify(el)
      if (target) send({ eventType: 'click', path: path(), target })
    },
    { capture: true, passive: true },
  )
})
