import { useDb } from '../../../database/client'
import { contactSubmissions } from '../../../database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const id = parseInt(getRouterParam(event, 'id')!)
  const db = useDb()
  await db.update(contactSubmissions).set({ isRead: true }).where(eq(contactSubmissions.id, id))
  return { success: true }
})
