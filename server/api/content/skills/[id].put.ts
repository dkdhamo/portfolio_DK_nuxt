import { useDb } from '../../../database/client'
import { skills } from '../../../database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const id = parseInt(getRouterParam(event, 'id')!)
  const body = await readBody(event)
  const db = useDb()
  await db.update(skills).set({
    name: body.name,
    percentage: body.percentage,
    sortOrder: body.sortOrder,
  }).where(eq(skills.id, id))
  return { success: true }
})
