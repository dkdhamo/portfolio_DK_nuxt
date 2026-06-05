export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  future: { compatibilityVersion: 4 },

  modules: ['nuxt-auth-utils'],

  css: [
    '~/assets/css/style.css',
  ],

  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Poppins:400,400i,500,500i,600,600i,700,700i,800,800i,900,900i' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,400i,600,600i,700' },
        { rel: 'stylesheet', href: '/css/bootstrap.min.css' },
        { rel: 'stylesheet', href: '/css/preloader.min.css' },
        { rel: 'stylesheet', href: '/css/circle.css' },
        { rel: 'stylesheet', href: '/css/font-awesome.min.css' },
        { rel: 'stylesheet', href: '/css/fm.revealator.jquery.min.css' },
        { rel: 'stylesheet', href: '/css/styleswitcher.css' },
      ],
      script: [
        { src: '/js/modernizr.custom.js' },
      ],
    },
  },

  runtimeConfig: {
    tursoUrl: process.env.TURSO_DATABASE_URL,
    tursoToken: process.env.TURSO_AUTH_TOKEN,
    resendApiKey: process.env.RESEND_API_KEY,
    contactRecipientEmail: process.env.CONTACT_RECIPIENT_EMAIL || 'webtechians.dev@gmail.com',
    adminGithubLogin: process.env.ADMIN_GITHUB_LOGIN,
    public: {},
  },

  nitro: {
    preset: 'vercel',
  },
})
