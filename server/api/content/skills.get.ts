import { useDb } from '../../database/client'
import { skills } from '../../database/schema'
import { asc } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const db = useDb()
  return db.select().from(skills).orderBy(asc(skills.sortOrder))
})
