<template>
  <section class="container-fluid main-container container-home p-0">
    <div class="home-mesh"></div>
    <div class="color-block d-none d-lg-block"></div>
    <div class="row home-details-container align-items-center">
      <div class="col-lg-4 bg position-fixed d-none d-lg-block"></div>
      <div class="col-12 col-lg-8 offset-lg-4 home-details text-left text-sm-center text-lg-left reveal">
        <div>
          <NuxtImg
            :src="info?.profileImageUrl || '/img/blog/edited_pp.jpg'"
            class="img-fluid main-img-mobile d-sm-block d-lg-none"
            alt="Profile picture"
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
          </h1>
          <div class="typewriter-line open-sans-font">
            <span>{{ twDisplay }}</span><span class="typewriter-cursor"></span>
          </div>
          <p class="open-sans-font mt-2">{{ info?.bio || "I'm a full-stack developer focused on crafting clean & user‑friendly experiences." }}</p>

          <div class="home-social">
            <a v-if="info?.linkedinUrl" :href="info.linkedinUrl" target="_blank" rel="noopener" aria-label="LinkedIn">
              <i class="fa fa-linkedin"></i>
            </a>
            <a v-if="info?.twitterUrl" :href="info.twitterUrl" target="_blank" rel="noopener" aria-label="Github">
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

const ogImage = computed(() => {
  const img = info.value?.profileImageUrl || '/img/blog/edited_pp.jpg'
  return img.startsWith('http') ? img : `${BASE}${img}`
})

useSeoMeta({
  title: computed(() => `${info.value?.firstName || 'DK'} – Personal Portfolio`),
  description: computed(() => info.value?.bio || "Full-stack developer focused on crafting clean & user-friendly web experiences."),
  ogTitle: computed(() => `${info.value?.firstName || 'DK'} – Personal Portfolio`),
  ogDescription: computed(() => info.value?.bio || "Full-stack developer focused on crafting clean & user-friendly web experiences."),
  ogUrl: `${BASE}/`,
  ogImage,
  twitterCard: 'summary_large_image',
  twitterImage: ogImage,
})
useHead({
  bodyAttrs: { class: 'home' },
  link: [{ rel: 'canonical', href: `${BASE}/` }],
  script: [{
    type: 'application/ld+json',
    innerHTML: computed(() => JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: [info.value?.firstName, info.value?.lastName].filter(Boolean).join(' ') || 'DK',
      url: BASE,
      jobTitle: info.value?.title || 'Full Stack Developer',
      description: info.value?.bio || '',
      email: info.value?.contactEmail || info.value?.email || '',
      sameAs: [info.value?.linkedinUrl, info.value?.twitterUrl].filter(Boolean),
      image: ogImage.value,
    })),
  }],
})

const phrases = computed<string[]>(() => {
  const title: string = info.value?.title || ''
  if (!title) return ['Full Stack Developer']
  return title.includes(',') ? title.split(',').map((s: string) => s.trim()) : [title]
})

const { display: twDisplay } = useTypewriter(phrases)
</script>
