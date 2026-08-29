import { useDb } from '../../database/client'
import { personalInfo } from '../../database/schema'
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
    currentRole: body.currentRole,
    focus: body.focus,
    city: body.city,
    phone: body.phone,
    email: body.email,
    cvUrl: body.cvUrl,
    profileImageUrl: body.profileImageUrl,
    contactEmail: body.contactEmail,
    linkedinUrl: body.linkedinUrl,
    githubUrl: body.githubUrl,
  }).where(eq(personalInfo.id, 1))

  return { success: true }
})
