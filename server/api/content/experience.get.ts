import { useDb } from '../../database/client'
import { experience } from '../../database/schema'
import { asc } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const db = useDb()
  return db.select().from(experience).orderBy(asc(experience.sortOrder))
})
