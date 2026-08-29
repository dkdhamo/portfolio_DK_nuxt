import { useDb } from '../../database/client'
import { projects } from '../../database/schema'
import { and, asc, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')!
  const db = useDb()
  const project = await db
    .select()
    .from(projects)
    .where(and(eq(projects.slug, slug), eq(projects.active, true)))
    .get()

  if (!project) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found' })
  }

  // The "next case study" link needs only slug/title for every project, not
  // the full row (case-study body text, gallery images) for every project —
  // computed here so the page doesn't have to re-fetch the whole list.
  const nav = await db
    .select({ slug: projects.slug, title: projects.title })
    .from(projects)
    .where(eq(projects.active, true))
    .orderBy(asc(projects.sortOrder))

  const idx = nav.findIndex((p) => p.slug === slug)
  const next = nav.length > 1 && idx !== -1 ? nav[(idx + 1) % nav.length] : null

  return { ...project, next }
})
