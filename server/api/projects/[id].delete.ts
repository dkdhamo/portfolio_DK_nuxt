import { useDb } from '../../database/client'
import { projects } from '../../database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const id = parseInt(getRouterParam(event, 'id')!)
  const db = useDb()
  await db.delete(projects).where(eq(projects.id, id))
  return { success: true }
})
