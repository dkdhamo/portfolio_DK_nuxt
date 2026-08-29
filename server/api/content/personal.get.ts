import { useDb } from '../../database/client'
import { personalInfo, highlights } from '../../database/schema'
import { asc, eq } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const db = useDb()
  const [info, highlightList] = await Promise.all([
    db.select().from(personalInfo).where(eq(personalInfo.id, 1)).get(),
    db.select().from(highlights).orderBy(asc(highlights.sortOrder)),
  ])
  return { info, highlights: highlightList }
})
