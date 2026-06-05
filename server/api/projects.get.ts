import { useDb } from '../database/client'
import { projects } from '../database/schema'
import { asc, eq } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const db = useDb()
  return db.select().from(projects).where(eq(projects.active, true)).orderBy(asc(projects.sortOrder))
})
