import { createHash } from 'node:crypto'

/**
 * Minimal User-Agent parsing.
 *
 * Deliberately not a dependency — this only needs to answer "which browser,
 * which OS, phone or desktop" for a dashboard, not to be exhaustive. Order
 * matters: Edge/Opera/Brave all carry "Chrome" in their UA, and iPadOS
 * reports itself as Macintosh, so the more specific tests run first.
 */
export function parseUserAgent(ua: string) {
  const s = ua || ''

  let browser = 'Unknown'
  let browserVersion = ''
  const browserTests: [string, RegExp][] = [
    ['Edge', /Edg(?:e|A|iOS)?\/([\d.]+)/],
    ['Opera', /(?:OPR|Opera)\/([\d.]+)/],
    ['Samsung Internet', /SamsungBrowser\/([\d.]+)/],
    ['Firefox', /(?:Firefox|FxiOS)\/([\d.]+)/],
    // Chrome on iOS is CriOS; real Safari has Version/x before Safari/x
    ['Chrome', /(?:Chrome|CriOS)\/([\d.]+)/],
    ['Safari', /Version\/([\d.]+).*Safari/],
  ]
  for (const [name, re] of browserTests) {
    const m = s.match(re)
    if (m) {
      browser = name
      browserVersion = (m[1] || '').split('.')[0] || ''
      break
    }
  }

  let os = 'Unknown'
  if (/Windows NT 10/.test(s)) os = 'Windows'
  else if (/Windows/.test(s)) os = 'Windows'
  else if (/Android/.test(s)) os = 'Android'
  else if (/iPhone|iPod/.test(s)) os = 'iOS'
  else if (/iPad/.test(s)) os = 'iPadOS'
  else if (/Mac OS X/.test(s)) os = 'macOS'
  else if (/CrOS/.test(s)) os = 'ChromeOS'
  else if (/Linux/.test(s)) os = 'Linux'

  let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop'
  if (/iPad|Tablet|PlayBook|Silk/.test(s) || (/Android/.test(s) && !/Mobile/.test(s))) {
    deviceType = 'tablet'
  } else if (/Mobi|iPhone|iPod|Android.*Mobile|Windows Phone/.test(s)) {
    deviceType = 'mobile'
  }

  return { browser, browserVersion, os, deviceType }
}

/**
 * Crawlers and uptime checks would otherwise dominate the numbers for a
 * small site — a portfolio gets more bot traffic than human traffic.
 */
const BOT_RE = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora link preview|showyoubot|outbrain|pinterest|vkshare|W3C_Validator|whatsapp|telegram|discord|slack|lighthouse|headless|preview|monitor|uptime|curl|wget|python-requests|axios|got\/|node-fetch/i

export function isBot(ua: string): boolean {
  if (!ua) return true // no UA at all is not a real browser
  return BOT_RE.test(ua)
}

/**
 * A per-day, per-visitor identifier that cannot be reversed into an IP and
 * cannot be linked across days.
 *
 * The UTC date is part of the input, so the same person browsing tomorrow
 * hashes to something completely different. That is the point: it supports
 * "how many unique people today" without building a profile of anyone.
 */
export function dailyVisitorHash(ip: string, ua: string, salt: string, when = new Date()): string {
  const day = when.toISOString().slice(0, 10) // YYYY-MM-DD, UTC
  return createHash('sha256')
    .update(`${day}|${ip}|${ua}|${salt}`)
    .digest('hex')
    .slice(0, 32)
}

/** Host only — the full referrer URL is kept separately for detail views. */
export function safeHost(url: string): string {
  if (!url) return ''
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

/** Defensive cap so a malformed or hostile payload can't bloat a row. */
export function clampStr(v: unknown, max: number): string {
  if (typeof v !== 'string') return ''
  return v.slice(0, max)
}

export function clampInt(v: unknown, min: number, max: number): number | null {
  const n = typeof v === 'number' ? v : parseInt(String(v), 10)
  if (!Number.isFinite(n)) return null
  return Math.min(Math.max(Math.round(n), min), max)
}

export function clampFloat(v: unknown, min: number, max: number): number | null {
  const n = typeof v === 'number' ? v : parseFloat(String(v))
  if (!Number.isFinite(n)) return null
  return Math.min(Math.max(n, min), max)
}
