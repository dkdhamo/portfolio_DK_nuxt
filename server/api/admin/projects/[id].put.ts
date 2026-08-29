import { useDb } from '../../../database/client'
import { projects } from '../../../database/schema'
import { slugify } from '../../../utils/slugify'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const id = parseInt(getRouterParam(event, 'id')!)
  const body = await readBody(event)
  const db = useDb()
  await db.update(projects).set({
    slug: slugify(body.slug || body.title),
    title: body.title,
    projectType: body.projectType,
    client: body.client,
    tools: body.tools,
    year: body.year,
    summary: body.summary,
    problem: body.problem,
    approach: body.approach,
    outcome: body.outcome,
    previewUrl: body.previewUrl,
    repoUrl: body.repoUrl,
    thumbnailUrl: body.thumbnailUrl,
    images: JSON.stringify(body.images ?? []),
    sortOrder: body.sortOrder,
    active: body.active,
  }).where(eq(projects.id, id))
  return { success: true }
})
