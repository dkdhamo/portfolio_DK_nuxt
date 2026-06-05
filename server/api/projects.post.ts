import { useDb } from '../database/client'
import { projects } from '../database/schema'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const body = await readBody(event)
  const db = useDb()
  const result = await db.insert(projects).values({
    title: body.title,
    projectType: body.projectType,
    client: body.client,
    tools: body.tools,
    previewUrl: body.previewUrl ?? '',
    thumbnailUrl: body.thumbnailUrl,
    images: JSON.stringify(body.images ?? []),
    sortOrder: body.sortOrder ?? 0,
    active: body.active ?? true,
  }).returning()
  return result[0]
})
