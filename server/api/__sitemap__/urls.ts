import { useDb } from '../../database/client'
import { projects } from '../../database/schema'
import { asc, eq } from 'drizzle-orm'

// Case-study pages are database-driven, so the sitemap has to ask the DB
// for them rather than list them statically in nuxt.config.
export default defineSitemapEventHandler(async () => {
  const db = useDb()
  const rows = await db
    .select({ slug: projects.slug })
    .from(projects)
    .where(eq(projects.active, true))
    .orderBy(asc(projects.sortOrder))

  return rows.map((row) => ({
    loc: `/portfolio/${row.slug}`,
    priority: 0.8,
    changefreq: 'monthly' as const,
  }))
})
