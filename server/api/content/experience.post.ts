import { useDb } from '../../database/client'
import { experience } from '../../database/schema'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const body = await readBody(event)
  const db = useDb()
  const result = await db.insert(experience).values({
    year: body.year,
    title: body.title,
    company: body.company,
    description: body.description,
    type: body.type ?? 'work',
    sortOrder: body.sortOrder ?? 0,
  }).returning()
  return result[0]
})
