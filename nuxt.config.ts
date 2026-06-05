export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  future: { compatibilityVersion: 4 },

  modules: [
    'nuxt-auth-utils',
    '@nuxt/fonts',
    '@nuxt/image',
    '@vercel/speed-insights',
    '@nuxtjs/sitemap',
  ],

  sitemap: {
    exclude: ['/admin', '/admin/**'],
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
    },
  },
})
