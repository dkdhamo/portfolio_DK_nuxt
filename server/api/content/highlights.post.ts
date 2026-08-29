import { useDb } from '../../database/client'
import { highlights } from '../../database/schema'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const body = await readBody(event)
  const db = useDb()
  const result = await db.insert(highlights).values({
    value: body.value,
    label: body.label,
    sortOrder: body.sortOrder ?? 0,
  }).returning()
  return result[0]
})
