import { useDb } from '../../database/client'
import { analyticsEvents } from '../../database/schema'
import { and, desc, eq, gte, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const query = getQuery(event)
  const days = Math.min(Math.max(parseInt(String(query.days ?? '30'), 10) || 30, 1), 365)

  const since = new Date()
  since.setUTCHours(0, 0, 0, 0)
  since.setUTCDate(since.getUTCDate() - (days - 1))

  const db = useDb()
  const inRange = gte(analyticsEvents.createdAt, since)

  // created_at is stored as a unix timestamp (seconds), so date grouping has
  // to go through SQLite's date functions rather than string slicing.
  const day = sql<string>`date(${analyticsEvents.createdAt}, 'unixepoch')`

  const [
    daily,
    totals,
    topPages,
    topReferrers,
    topCountries,
    browsers,
    devices,
    operatingSystems,
    clickTargets,
    recent,
  ] = await Promise.all([
    // Views + unique visitors per day
    db
      .select({
        day,
        views: sql<number>`count(*)`,
        visitors: sql<number>`count(distinct ${analyticsEvents.visitorHash})`,
      })
      .from(analyticsEvents)
      .where(and(inRange, eq(analyticsEvents.eventType, 'pageview')))
      .groupBy(day)
      .orderBy(day),

    db
      .select({
        views: sql<number>`sum(case when ${analyticsEvents.eventType} = 'pageview' then 1 else 0 end)`,
        clicks: sql<number>`sum(case when ${analyticsEvents.eventType} = 'click' then 1 else 0 end)`,
        visitors: sql<number>`count(distinct ${analyticsEvents.visitorHash})`,
        avgLoadMs: sql<number>`avg(${analyticsEvents.loadTimeMs})`,
      })
      .from(analyticsEvents)
      .where(inRange)
      .get(),

    db
      .select({ label: analyticsEvents.path, count: sql<number>`count(*)` })
      .from(analyticsEvents)
      .where(and(inRange, eq(analyticsEvents.eventType, 'pageview')))
      .groupBy(analyticsEvents.path)
      .orderBy(desc(sql`count(*)`))
      .limit(15),

    // Empty referrerHost means the visitor typed the URL or came from a
    // client that strips it — surfaced as "Direct" in the UI.
    db
      .select({ label: analyticsEvents.referrerHost, count: sql<number>`count(*)` })
      .from(analyticsEvents)
      .where(and(inRange, eq(analyticsEvents.eventType, 'pageview')))
      .groupBy(analyticsEvents.referrerHost)
      .orderBy(desc(sql`count(*)`))
      .limit(15),

    db
      .select({ label: analyticsEvents.country, count: sql<number>`count(*)` })
      .from(analyticsEvents)
      .where(and(inRange, eq(analyticsEvents.eventType, 'pageview')))
      .groupBy(analyticsEvents.country)
      .orderBy(desc(sql`count(*)`))
      .limit(15),

    db
      .select({ label: analyticsEvents.browser, count: sql<number>`count(*)` })
      .from(analyticsEvents)
      .where(and(inRange, eq(analyticsEvents.eventType, 'pageview')))
      .groupBy(analyticsEvents.browser)
      .orderBy(desc(sql`count(*)`))
      .limit(10),

    db
      .select({ label: analyticsEvents.deviceType, count: sql<number>`count(*)` })
      .from(analyticsEvents)
      .where(and(inRange, eq(analyticsEvents.eventType, 'pageview')))
      .groupBy(analyticsEvents.deviceType)
      .orderBy(desc(sql`count(*)`))
      .limit(10),

    db
      .select({ label: analyticsEvents.os, count: sql<number>`count(*)` })
      .from(analyticsEvents)
      .where(and(inRange, eq(analyticsEvents.eventType, 'pageview')))
      .groupBy(analyticsEvents.os)
      .orderBy(desc(sql`count(*)`))
      .limit(10),

    db
      .select({ label: analyticsEvents.target, count: sql<number>`count(*)` })
      .from(analyticsEvents)
      .where(and(inRange, eq(analyticsEvents.eventType, 'click')))
      .groupBy(analyticsEvents.target)
      .orderBy(desc(sql`count(*)`))
      .limit(20),

    db
      .select()
      .from(analyticsEvents)
      .where(inRange)
      .orderBy(desc(analyticsEvents.createdAt))
      .limit(100),
  ])

  // SQLite only returns days that actually have rows; the chart needs a
  // continuous axis, so fill the gaps with zeroes.
  const series: { day: string; views: number; visitors: number }[] = []
  const byDay = new Map(daily.map((d) => [d.day, d]))
  for (let i = 0; i < days; i++) {
    const d = new Date(since)
    d.setUTCDate(d.getUTCDate() + i)
    const key = d.toISOString().slice(0, 10)
    const found = byDay.get(key)
    series.push({ day: key, views: found?.views ?? 0, visitors: found?.visitors ?? 0 })
  }

  return {
    days,
    series,
    totals: {
      views: totals?.views ?? 0,
      clicks: totals?.clicks ?? 0,
      visitors: totals?.visitors ?? 0,
      avgLoadMs: totals?.avgLoadMs ? Math.round(totals.avgLoadMs) : null,
    },
    breakdowns: {
      pages: topPages,
      referrers: topReferrers,
      countries: topCountries,
      browsers,
      devices,
      operatingSystems,
      clickTargets,
    },
    recent,
  }
})
