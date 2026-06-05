import { useDb } from '../../database/client'
import { projects } from '../../database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const id = parseInt(getRouterParam(event, 'id')!)
  const body = await readBody(event)
  const db = useDb()
  await db.update(projects).set({
    title: body.title,
    projectType: body.projectType,
    client: body.client,
    tools: body.tools,
    previewUrl: body.previewUrl,
    thumbnailUrl: body.thumbnailUrl,
    images: JSON.stringify(body.images ?? []),
    sortOrder: body.sortOrder,
    active: body.active,
  }).where(eq(projects.id, id))
  return { success: true }
})
