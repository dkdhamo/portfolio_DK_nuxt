export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  future: { compatibilityVersion: 4 },

  // Required by @nuxtjs/sitemap v8 to generate absolute URLs
  site: {
    url: 'https://dkthecoder.online',
    name: 'Dhamodhara Kannan Portfolio',
  },

  modules: [
    'nuxt-auth-utils',
    '@nuxt/fonts',
    '@nuxt/image',
    '@vercel/speed-insights',
    '@nuxtjs/sitemap',
  ],

  sitemap: {
    exclude: ['/admin', '/admin/**'],
    // Case-study pages come from the database
    sources: ['/api/__sitemap__/urls'],
    urls: [
      { loc: '/',          priority: 1.0, changefreq: 'monthly' },
      { loc: '/about',     priority: 0.9, changefreq: 'monthly' },
      { loc: '/portfolio', priority: 0.9, changefreq: 'weekly'  },
      { loc: '/contact',   priority: 0.7, changefreq: 'yearly'  },
    ],
  },

  css: [
    '~/assets/css/style.css',
  ],

  // @nuxt/fonts: auto-detects Poppins + Open Sans from style.css, serves them locally
  fonts: {
    defaults: {
      preload: true,  // inject <link rel="preload"> for font files
    },
  },

  // @nuxt/image: quality + formats; Vercel provider auto-selected via nitro preset
  image: {
    quality: 80,
    format: ['webp', 'avif'],
  },

  app: {
    pageTransition: { name: 'page-fade', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        // Bootstrap is CRITICAL (grid layout) — must stay blocking
        { rel: 'stylesheet', href: '/css/bootstrap.min.css' },
        // font-awesome and circle.css are loaded deferred via plugin (not blocking)
        // Google Fonts removed — @nuxt/fonts serves them locally
      ],
    },
  },

  runtimeConfig: {
    tursoUrl: process.env.TURSO_DATABASE_URL,
    tursoToken: process.env.TURSO_AUTH_TOKEN,
    resendApiKey: process.env.RESEND_API_KEY,
    contactRecipientEmail: process.env.CONTACT_RECIPIENT_EMAIL || 'webtechians.dev@gmail.com',
    adminGithubLogin: process.env.ADMIN_GITHUB_LOGIN,
  },

  nitro: {
    preset: 'vercel',
    // Gzip + Brotli compress all public assets
    compressPublicAssets: { brotli: true, gzip: true },
    routeRules: {
      // Long-lived cache for all static assets (hashed filenames mean safe to cache forever)
      '/css/**':   { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/fonts/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/img/**':   { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/js/**':    { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      // API routes: short cache, revalidate in background
      '/api/**':   { headers: { 'cache-control': 'public, s-maxage=60, stale-while-revalidate=600' } },
      // Editable content is read back by the admin panel right after saving —
      // a shared CDN cache would show stale data for up to 10 minutes.
      '/api/content/**': { headers: { 'cache-control': 'no-store' } },
      // Admin API routes are per-session and must never be cached/shared via the CDN
      '/api/admin/**': { headers: { 'cache-control': 'private, no-store' } },

      // Public pages: ISR on Vercel. Every request currently re-queries Turso
      // (personal_info/highlights/skills/experience/projects) even though the
      // content only changes when the admin panel is used — serve the cached
      // render instead and regenerate at most once a minute, so a visitor's
      // TTFB doesn't depend on a database round trip. An edit in /admin can
      // take up to ~60s to appear on the live pages as a result; /admin itself
      // is untouched by this and always renders fresh.
      '/':              { isr: 60 },
      '/about':         { isr: 60 },
      '/portfolio':     { isr: 60 },
      '/portfolio/**':  { isr: 60 },
      '/contact':       { isr: 60 },
    },
  },
})
