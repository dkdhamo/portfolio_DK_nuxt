import { useDb } from '../../database/client'
import { projects } from '../../database/schema'
import { and, eq } from 'drizzle-orm'

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
  return project
})
