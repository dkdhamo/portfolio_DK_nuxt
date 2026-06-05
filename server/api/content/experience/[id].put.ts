import { useDb } from '../../../database/client'
import { experience } from '../../../database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const id = parseInt(getRouterParam(event, 'id')!)
  const body = await readBody(event)
  const db = useDb()
  await db.update(experience).set({
    year: body.year,
    title: body.title,
    company: body.company,
    description: body.description,
    type: body.type,
    sortOrder: body.sortOrder,
  }).where(eq(experience.id, id))
  return { success: true }
})
