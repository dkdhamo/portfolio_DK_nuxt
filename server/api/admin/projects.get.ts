import { useDb } from '../../database/client'
import { projects } from '../../database/schema'
import { asc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const db = useDb()
  return db.select().from(projects).orderBy(asc(projects.sortOrder))
})
