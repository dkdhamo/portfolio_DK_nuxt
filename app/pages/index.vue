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
useSeoMeta({
  title: 'DK – Personal Portfolio',
  description: 'Personal portfolio of DK — full-stack developer.',
  ogTitle: 'DK – Personal Portfolio',
  ogDescription: 'Personal portfolio of DK — full-stack developer.',
  twitterCard: 'summary_large_image',
})
useHead({ bodyAttrs: { class: 'home' } })

const { data } = await useFetch('/api/content/personal')
const info = computed(() => (data.value as any)?.info)

const phrases = computed<string[]>(() => {
  const title: string = info.value?.title || ''
  if (!title) return ['Full Stack Developer']
  return title.includes(',') ? title.split(',').map((s: string) => s.trim()) : [title]
})

const { display: twDisplay } = useTypewriter(phrases)
</script>
