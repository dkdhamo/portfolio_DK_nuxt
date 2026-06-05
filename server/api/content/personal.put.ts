import { useDb } from '../../database/client'
import { personalInfo, stats } from '../../database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const body = await readBody(event)

  const db = useDb()

  await db.update(personalInfo).set({
    firstName: body.firstName,
    lastName: body.lastName,
    title: body.title,
    bio: body.bio,
    city: body.city,
    phone: body.phone,
    email: body.email,
    age: body.age,
    nationality: body.nationality,
    language: body.language,
    freelanceAvailable: body.freelanceAvailable,
    cvUrl: body.cvUrl,
    profileImageUrl: body.profileImageUrl,
    contactEmail: body.contactEmail,
    facebookUrl: body.facebookUrl,
    twitterUrl: body.twitterUrl,
    linkedinUrl: body.linkedinUrl,
    dribbbleUrl: body.dribbbleUrl,
  }).where(eq(personalInfo.id, 1))

  if (body.stats) {
    await db.update(stats).set({
      yearsExperience: body.stats.yearsExperience,
      completedProjects: body.stats.completedProjects,
      happyClients: body.stats.happyClients,
      awardsWon: body.stats.awardsWon,
    }).where(eq(stats.id, 1))
  }

  return { success: true }
})
