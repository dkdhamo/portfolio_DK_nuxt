import { useDb } from '../../database/client'
import { projects } from '../../database/schema'
import { slugify } from '../../utils/slugify'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const body = await readBody(event)
  const db = useDb()
  const result = await db.insert(projects).values({
    slug: slugify(body.slug || body.title),
    title: body.title,
    projectType: body.projectType,
    client: body.client,
    tools: body.tools,
    year: body.year ?? '',
    summary: body.summary ?? '',
    problem: body.problem ?? '',
    approach: body.approach ?? '',
    outcome: body.outcome ?? '',
    previewUrl: body.previewUrl ?? '',
    repoUrl: body.repoUrl ?? '',
    thumbnailUrl: body.thumbnailUrl,
    images: JSON.stringify(body.images ?? []),
    sortOrder: body.sortOrder ?? 0,
    active: body.active ?? true,
  }).returning()
  return result[0]
})
