import { useDb } from '../database/client'
import { analyticsEvents } from '../database/schema'
import { lt } from 'drizzle-orm'
import {
  parseUserAgent,
  isBot,
  dailyVisitorHash,
  safeHost,
  clampStr,
  clampInt,
  clampFloat,
} from '../utils/analytics'

// How long raw events are kept. Turso's free tier has row limits and nothing
// on the dashboard looks further back than this.
const RETENTION_DAYS = 180

export default defineEventHandler(async (event) => {
  const ua = getRequestHeader(event, 'user-agent') || ''

  // Silently accept and drop bot traffic — returning an error would just
  // add noise to logs for something that happens constantly.
  if (isBot(ua)) return { ok: true }

  const body = await readBody(event).catch(() => null)
  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, message: 'Invalid payload' })
  }

  const path = clampStr(body.path, 300)
  if (!path.startsWith('/')) {
    throw createError({ statusCode: 400, message: 'Invalid path' })
  }
  // The admin panel is mine, not an audience — never record it.
  if (path === '/admin' || path.startsWith('/admin/')) return { ok: true }

  const eventType = body.eventType === 'click' ? 'click' : 'pageview'

  // Vercel resolves geo at the edge and passes it as headers; there is no
  // IP database to maintain here, and no GPS involved.
  const country = clampStr(getRequestHeader(event, 'x-vercel-ip-country') || '', 8)
  const region = clampStr(getRequestHeader(event, 'x-vercel-ip-country-region') || '', 32)
  const city = clampStr(
    decodeURIComponent(getRequestHeader(event, 'x-vercel-ip-city') || ''),
    64,
  )

  const ip =
    getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() ||
    getRequestHeader(event, 'x-real-ip') ||
    'unknown'

  const config = useRuntimeConfig()
  const salt = (config.analyticsSalt as string) || 'dk-portfolio-fallback-salt'

  const { browser, browserVersion, os, deviceType } = parseUserAgent(ua)
  const referrer = clampStr(body.referrer, 500)

  const db = useDb()

  await db.insert(analyticsEvents).values({
    eventType,
    path,
    target: clampStr(body.target, 200),
    // The IP is used to derive this and then discarded — never stored.
    visitorHash: dailyVisitorHash(ip, ua, salt),
    referrer,
    referrerHost: safeHost(referrer),
    utmSource: clampStr(body.utmSource, 100),
    utmMedium: clampStr(body.utmMedium, 100),
    utmCampaign: clampStr(body.utmCampaign, 100),
    country,
    region,
    city,
    browser,
    browserVersion,
    os,
    deviceType,
    screenWidth: clampInt(body.screenWidth, 0, 20000),
    screenHeight: clampInt(body.screenHeight, 0, 20000),
    viewportWidth: clampInt(body.viewportWidth, 0, 20000),
    viewportHeight: clampInt(body.viewportHeight, 0, 20000),
    pixelRatio: clampFloat(body.pixelRatio, 0, 10),
    language: clampStr(body.language, 32),
    timezone: clampStr(body.timezone, 64),
    colorScheme: clampStr(body.colorScheme, 16),
    connection: clampStr(body.connection, 16),
    cpuCores: clampInt(body.cpuCores, 0, 512),
    deviceMemory: clampFloat(body.deviceMemory, 0, 1024),
    touchPoints: clampInt(body.touchPoints, 0, 32),
    loadTimeMs: clampInt(body.loadTimeMs, 0, 600000),
    createdAt: new Date(),
  })

  // Opportunistic pruning — cheaper than a scheduled job for a site this
  // size, and keeps the table from growing without bound.
  if (Math.random() < 0.01) {
    const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000)
    await db.delete(analyticsEvents).where(lt(analyticsEvents.createdAt, cutoff))
  }

  return { ok: true }
})
