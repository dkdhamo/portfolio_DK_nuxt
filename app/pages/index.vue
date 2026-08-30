<template>
  <section class="container-fluid main-container container-home p-0">
    <div class="home-mesh"></div>
    <div class="color-block d-none d-lg-block"></div>
    <div class="row home-details-container align-items-center">
      <div class="col-lg-4 bg position-fixed d-none d-lg-block" :style="{ backgroundImage: `url(${bgImageUrl})` }"></div>
      <div class="col-12 col-lg-8 offset-lg-4 home-details text-left text-sm-center text-lg-left reveal">
        <div>
          <NuxtImg
            :src="info?.profileImageUrl || '/img/blog/edited_pp.jpg'"
            class="img-fluid main-img-mobile d-sm-block d-lg-none"
            alt="Dhamodhara Kannan (DK), full stack engineer"
            fetchpriority="high"
            loading="eager"
            width="400"
            height="400"
            format="webp"
            quality="85"
          />
          <h6 class="text-uppercase open-sans-font mb-0 d-block d-sm-none d-lg-block">hi there !</h6>
          <h1 class="text-uppercase poppins-font">
            <span>I'm</span> {{ info?.firstName ? info.firstName.split(' ')[0] : 'DK' }}
            <span class="hero-alias">(DK)</span>
          </h1>
          <div class="typewriter-line open-sans-font">
            <span>{{ twDisplay }}</span><span class="typewriter-cursor"></span>
          </div>
          <p class="open-sans-font mt-2">{{ heroTagline }}</p>

          <div class="home-social">
            <a v-if="info?.linkedinUrl" :href="info.linkedinUrl" target="_blank" rel="noopener" aria-label="LinkedIn">
              <i class="fa fa-linkedin"></i>
            </a>
            <a v-if="info?.githubUrl" :href="info.githubUrl" target="_blank" rel="noopener" aria-label="GitHub">
              <i class="fa fa-github"></i>
            </a>
          </div>

          <NuxtLink to="/about" class="btn btn-about mt-3">more about me</NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const BASE = 'https://dkthecoder.online'

const { data } = await useFetch('/api/content/personal')
const info = computed(() => (data.value as any)?.info)

// The desktop hero panel (.bg, ~col-lg-4 wide) was a plain CSS
// background-image pointed straight at the raw source file — 900KB at
// 2252x2252 for what renders as an ~500px-wide panel, bypassing image
// optimization entirely and landing as the page's LCP element. Route it
// through the same optimizer NuxtImg already uses for the mobile photo.
const $img = useImage()
const bgImageUrl = computed(() => {
  const src = info.value?.profileImageUrl || '/img/blog/edited_pp.jpg'
  return $img(src, { width: 900, quality: 80, format: 'webp' })
})

const ogImage = computed(() => {
  const img = info.value?.profileImageUrl || '/img/blog/edited_pp.jpg'
  return img.startsWith('http') ? img : `${BASE}${img}`
})

const fullName = computed(() => {
  const parts = [info.value?.firstName, info.value?.lastName].filter(Boolean)
  return parts.length ? parts.join(' ') : 'Dhamodhara Kannan'
})

const heroTagline = computed(() => {
  const bio = info.value?.bio || ''
  if (!bio) return "I'm a full-stack developer focused on crafting clean & user‑friendly experiences."
  const firstSentence = bio.match(/^.*?[.!?](?=\s|$)/)?.[0]
  return firstSentence || bio.slice(0, 140)
})

useSeoMeta({
  title: computed(() => `${fullName.value} (DK) – Full Stack Developer Portfolio`),
  description: computed(() => info.value?.bio || 'Portfolio of Dhamodhara Kannan, also known as DK – a full-stack software engineer crafting clean & user-friendly web experiences.'),
  keywords: 'Dhamodhara Kannan, DK, DK portfolio, DK software engineer, Dhamodhara Kannan software engineer, Dhamodhara Kannan portfolio, full stack developer, web developer',
  ogTitle: computed(() => `${fullName.value} (DK) – Full Stack Developer Portfolio`),
  ogDescription: computed(() => info.value?.bio || 'Portfolio of Dhamodhara Kannan, also known as DK – a full-stack software engineer crafting clean & user-friendly web experiences.'),
  ogUrl: `${BASE}/`,
  ogImage,
  twitterCard: 'summary_large_image',
  twitterImage: ogImage,
})
useHead({
  bodyAttrs: { class: 'home' },
  link: [
    { rel: 'canonical', href: `${BASE}/` },
    // CSS background-images are only discovered once styles are computed,
    // well after the HTML preload scanner has already run — preload it
    // explicitly so the desktop LCP image starts fetching immediately.
    // Scoped to the same breakpoint that shows the .bg panel (d-lg-block).
    { rel: 'preload', as: 'image', href: bgImageUrl.value, media: '(min-width: 992px)' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: fullName.value,
        alternateName: 'DK',
        url: BASE,
        jobTitle: info.value?.title || 'Full Stack Engineer',
        description: info.value?.bio || '',
        email: info.value?.contactEmail || info.value?.email || '',
        sameAs: [info.value?.linkedinUrl, info.value?.githubUrl].filter(Boolean),
        image: ogImage.value,
      })),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Dhamodhara Kannan Portfolio',
        alternateName: 'DK Portfolio',
        url: BASE,
      }),
    },
  ],
})

const phrases = computed<string[]>(() => {
  const title: string = info.value?.title || ''
  if (!title) return ['Full Stack Developer']
  return title.includes(',') ? title.split(',').map((s: string) => s.trim()) : [title]
})

const { display: twDisplay } = useTypewriter(phrases)
</script>
