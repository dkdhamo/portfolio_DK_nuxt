import { useDb } from '../../../database/client'
import { highlights } from '../../../database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const id = parseInt(getRouterParam(event, 'id')!)
  const body = await readBody(event)
  const db = useDb()
  await db.update(highlights).set({
    value: body.value,
    label: body.label,
    sortOrder: body.sortOrder,
  }).where(eq(highlights.id, id))
  return { success: true }
})
