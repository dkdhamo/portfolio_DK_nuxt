import { useDb } from '../../../database/client'
import { highlights } from '../../../database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const id = parseInt(getRouterParam(event, 'id')!)
  const db = useDb()
  await db.delete(highlights).where(eq(highlights.id, id))
  return { success: true }
})
