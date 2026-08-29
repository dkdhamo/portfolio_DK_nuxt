import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core'

export const personalInfo = sqliteTable('personal_info', {
  id: integer('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  title: text('title').notNull(),
  bio: text('bio').notNull(),
  // Short line under the name on /about — "Software Engineer at TransPerfect, Chennai"
  currentRole: text('current_role').notNull().default(''),
  // What kind of work you take on, in one sentence
  focus: text('focus').notNull().default(''),
  city: text('city').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  cvUrl: text('cv_url').notNull(),
  profileImageUrl: text('profile_image_url').notNull(),
  contactEmail: text('contact_email').notNull(),
  linkedinUrl: text('linkedin_url').default(''),
  githubUrl: text('github_url').default(''),
})

// Impact metrics shown on /about. Free-form label/value so they can say
// "40% → 85%" rather than only counting whole numbers.
export const highlights = sqliteTable('highlights', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  value: text('value').notNull(),
  label: text('label').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
})

export const skills = sqliteTable('skills', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  // Groups the tag cloud into readable columns: Backend, Frontend, Data, Platform
  category: text('category').notNull().default('Other'),
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
  // URL segment for /portfolio/<slug>
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  projectType: text('project_type').notNull(),
  client: text('client').notNull(),
  tools: text('tools').notNull(),
  year: text('year').notNull().default(''),
  // One line on the grid card and in search results
  summary: text('summary').notNull().default(''),
  // Case study body — the three questions a reader actually has
  problem: text('problem').notNull().default(''),
  approach: text('approach').notNull().default(''),
  outcome: text('outcome').notNull().default(''),
  previewUrl: text('preview_url').default(''),
  repoUrl: text('repo_url').default(''),
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
