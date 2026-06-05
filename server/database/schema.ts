import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core'

export const personalInfo = sqliteTable('personal_info', {
  id: integer('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  title: text('title').notNull(),
  bio: text('bio').notNull(),
  city: text('city').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  age: text('age').notNull(),
  nationality: text('nationality').notNull(),
  language: text('language').notNull(),
  freelanceAvailable: integer('freelance_available', { mode: 'boolean' }).notNull().default(true),
  cvUrl: text('cv_url').notNull(),
  profileImageUrl: text('profile_image_url').notNull(),
  contactEmail: text('contact_email').notNull(),
  facebookUrl: text('facebook_url').default(''),
  twitterUrl: text('twitter_url').default(''),
  linkedinUrl: text('linkedin_url').default(''),
  dribbbleUrl: text('dribbble_url').default(''),
})

export const stats = sqliteTable('stats', {
  id: integer('id').primaryKey(),
  yearsExperience: integer('years_experience').notNull().default(2),
  completedProjects: integer('completed_projects').notNull().default(5),
  happyClients: integer('happy_clients').notNull().default(3),
  awardsWon: integer('awards_won').notNull().default(3),
})

export const skills = sqliteTable('skills', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  percentage: integer('percentage').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
})

export const experience = sqliteTable('experience', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  year: text('year').notNull(),
  title: text('title').notNull(),
  company: text('company').notNull(),
  description: text('description').notNull(),
  type: text('type').notNull().default('work'),
  sortOrder: integer('sort_order').notNull().default(0),
})

export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  projectType: text('project_type').notNull(),
  client: text('client').notNull(),
  tools: text('tools').notNull(),
  previewUrl: text('preview_url').default(''),
  thumbnailUrl: text('thumbnail_url').notNull(),
  images: text('images').notNull().default('[]'),
  sortOrder: integer('sort_order').notNull().default(0),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
})

export const contactSubmissions = sqliteTable('contact_submissions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})
