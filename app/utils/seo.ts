/**
 * Single source of truth for canonical URLs and structured data.
 *
 * The host matters: dkthecoder.online 308-redirects to www.dkthecoder.online,
 * so every canonical, og:url, JSON-LD url and sitemap entry has to name the
 * www host. Pointing them at the redirecting host makes Google follow a
 * canonical into a redirect, which splits ranking signals between two URLs
 * for the same page.
 */
export const SITE_URL = 'https://www.dkthecoder.online'
export const SITE_NAME = 'Dhamodhara Kannan (DK) — Full Stack Engineer'
export const SITE_SHORT = 'DK Portfolio'

/** Name variants people actually search for. Used in `alternateName`. */
export const NAME_VARIANTS = [
  'DK',
  'dkthecoder',
  'DK The Coder',
  'Dhamodhara Kannan A',
  'Dhamodharan',
]

export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

/** Search results truncate around 155–160 characters; cut on a word. */
export function metaDescription(text: string, max = 155): string {
  const clean = (text || '').replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return clean.slice(0, clean.lastIndexOf(' ', max - 1)).replace(/[,;:.–—-]$/, '') + '…'
}

type Info = Record<string, any> | null | undefined

/**
 * The Person entity, assembled from whatever the admin panel currently holds
 * rather than hardcoded, so it stays true after content edits.
 *
 * This is the part that matters for name searches — `alternateName`,
 * `sameAs`, `worksFor` and `alumniOf` are how a search engine works out that
 * "DK", "dkthecoder" and "Dhamodhara Kannan" are one person, and which one.
 */
export function personSchema(opts: {
  info: Info
  skills?: { name: string }[]
  experience?: { company: string; title: string; type: string }[]
  image: string
}) {
  const { info, skills = [], experience = [], image } = opts

  const fullName =
    [info?.firstName, info?.lastName].filter(Boolean).join(' ') || 'Dhamodhara Kannan'

  const currentJob = experience.find((e) => e.type === 'work')
  const education = experience.find((e) => e.type === 'education')

  // "TransPerfect, Chennai" → "TransPerfect"
  const orgName = (v?: string) => (v || '').split(',')[0]?.trim()

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: fullName,
    alternateName: NAME_VARIANTS,
    url: SITE_URL,
    image,
    jobTitle: info?.title?.split(',')[0]?.trim() || 'Full Stack Engineer',
    description: info?.bio || '',
    sameAs: [info?.linkedinUrl, info?.githubUrl].filter(Boolean),
  }

  const email = info?.contactEmail || info?.email
  if (email) schema.email = email

  if (info?.city) {
    const [locality, country] = String(info.city).split(',').map((s: string) => s.trim())
    schema.address = {
      '@type': 'PostalAddress',
      addressLocality: locality || 'Chennai',
      addressCountry: country || 'India',
    }
  }

  if (currentJob?.company) {
    schema.worksFor = { '@type': 'Organization', name: orgName(currentJob.company) }
  }
  if (education?.company) {
    schema.alumniOf = { '@type': 'CollegeOrUniversity', name: orgName(education.company) }
  }
  if (skills.length) {
    schema.knowsAbout = skills.map((s) => s.name)
  }

  return schema
}

export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: SITE_SHORT,
    url: SITE_URL,
    inLanguage: 'en',
    publisher: { '@id': `${SITE_URL}/#person` },
  }
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

/** Shared og/twitter fields so every page carries the same site identity. */
export function socialMeta(opts: { title: string; description: string; url: string; image: string; type?: string }) {
  return {
    ogTitle: opts.title,
    ogDescription: opts.description,
    ogUrl: opts.url,
    ogImage: opts.image,
    ogImageAlt: 'Dhamodhara Kannan (DK), full stack engineer',
    ogType: opts.type || 'website',
    ogSiteName: SITE_NAME,
    ogLocale: 'en_US',
    twitterCard: 'summary_large_image',
    twitterTitle: opts.title,
    twitterDescription: opts.description,
    twitterImage: opts.image,
    twitterImageAlt: 'Dhamodhara Kannan (DK), full stack engineer',
  }
}
