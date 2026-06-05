import { useDb } from '../../../database/client'
import { experience } from '../../../database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const id = parseInt(getRouterParam(event, 'id')!)
  const db = useDb()
  await db.delete(experience).where(eq(experience.id, id))
  return { success: true }
})
