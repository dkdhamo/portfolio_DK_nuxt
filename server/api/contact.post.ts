import { useDb } from '../database/client'
import { contactSubmissions } from '../database/schema'
import { Resend } from 'resend'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.name || !body.email || !body.message) {
    throw createError({ statusCode: 400, message: 'Name, email and message are required.' })
  }

  const db = useDb()
  await db.insert(contactSubmissions).values({
    name: body.name,
    email: body.email,
    subject: body.subject ?? '(no subject)',
    message: body.message,
    isRead: false,
    createdAt: new Date(),
  })

  const config = useRuntimeConfig()
  if (config.resendApiKey) {
    try {
      const resend = new Resend(config.resendApiKey)
      await resend.emails.send({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: config.contactRecipientEmail as string,
        replyTo: body.email,
        subject: `Portfolio Contact: ${body.subject || 'New message from ' + body.name}`,
        html: `
          <h3>New contact form submission</h3>
          <p><strong>Name:</strong> ${body.name}</p>
          <p><strong>Email:</strong> ${body.email}</p>
          <p><strong>Subject:</strong> ${body.subject}</p>
          <hr/>
          <p>${body.message.replace(/\n/g, '<br/>')}</p>
        `,
      })
    } catch (e) {
      console.error('Email send failed:', e)
    }
  }

  return { success: true }
})
