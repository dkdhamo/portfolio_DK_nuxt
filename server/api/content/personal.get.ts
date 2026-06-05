import { useDb } from '../../database/client'
import { personalInfo, stats } from '../../database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const db = useDb()
  const [info, stat] = await Promise.all([
    db.select().from(personalInfo).where(eq(personalInfo.id, 1)).get(),
    db.select().from(stats).where(eq(stats.id, 1)).get(),
  ])
  return { info, stats: stat }
})
