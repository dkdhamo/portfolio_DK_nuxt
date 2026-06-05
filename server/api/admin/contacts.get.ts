import { useDb } from '../../database/client'
import { contactSubmissions } from '../../database/schema'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const db = useDb()
  return db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt))
})
