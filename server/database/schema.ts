import { integer, real, text, sqliteTable, index } from 'drizzle-orm/sqlite-core'

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

// Self-hosted, cookie-free analytics.
//
// Deliberately stores no raw IP address and sets no cookie. Visitors are
// counted via `visitorHash`, a salted hash of IP + user agent that rotates
// at UTC midnight — enough to count unique people per day, useless for
// following anyone between days. This is the model Plausible/Fathom use and
// is what keeps this consent-exempt in most EU readings; storing the raw IP
// or a persistent cookie would not be.
export const analyticsEvents = sqliteTable('analytics_events', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  // 'pageview' | 'click'
  eventType: text('event_type').notNull().default('pageview'),
  path: text('path').notNull(),
  // For clicks: what was clicked — 'cv_download', 'project:<slug>',
  // 'social:github', 'outbound:<host>', 'contact_submit', …
  target: text('target').notNull().default(''),

  visitorHash: text('visitor_hash').notNull().default(''),

  // Acquisition
  referrer: text('referrer').notNull().default(''),
  referrerHost: text('referrer_host').notNull().default(''),
  utmSource: text('utm_source').notNull().default(''),
  utmMedium: text('utm_medium').notNull().default(''),
  utmCampaign: text('utm_campaign').notNull().default(''),

  // Coarse location, resolved server-side from the request. City/region are
  // whatever the CDN reports — never GPS, which would need a permission prompt.
  country: text('country').notNull().default(''),
  region: text('region').notNull().default(''),
  city: text('city').notNull().default(''),

  // Parsed from the User-Agent header
  browser: text('browser').notNull().default(''),
  browserVersion: text('browser_version').notNull().default(''),
  os: text('os').notNull().default(''),
  deviceType: text('device_type').notNull().default(''),

  // Reported by the page itself. Every one of these is readable from
  // JavaScript with no permission prompt.
  screenWidth: integer('screen_width'),
  screenHeight: integer('screen_height'),
  viewportWidth: integer('viewport_width'),
  viewportHeight: integer('viewport_height'),
  pixelRatio: real('pixel_ratio'),
  language: text('language').notNull().default(''),
  timezone: text('timezone').notNull().default(''),
  colorScheme: text('color_scheme').notNull().default(''),
  connection: text('connection').notNull().default(''),
  cpuCores: integer('cpu_cores'),
  deviceMemory: real('device_memory'),
  touchPoints: integer('touch_points'),
  // Real-world load time from the Navigation Timing API — the same number
  // Lighthouse estimates, but measured on actual visitors' devices.
  loadTimeMs: integer('load_time_ms'),

  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  // The dashboard always filters/groups by time, and counts distinct
  // visitors within a day.
  index('analytics_created_at_idx').on(table.createdAt),
  index('analytics_visitor_idx').on(table.visitorHash),
])

export const contactSubmissions = sqliteTable('contact_submissions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})
