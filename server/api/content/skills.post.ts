import { useDb } from '../../database/client'
import { skills } from '../../database/schema'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const body = await readBody(event)
  const db = useDb()
  const result = await db.insert(skills).values({
    name: body.name,
    percentage: body.percentage,
    sortOrder: body.sortOrder ?? 0,
  }).returning()
  return result[0]
})
