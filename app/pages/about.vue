<template>
  <div>
    <!-- Page Title -->
    <section class="title-section text-left text-sm-center reveal">
      <h1>ABOUT <span>ME</span></h1>
    </section>

    <!-- Main Content -->
    <section class="main-content reveal">
      <div class="container">

        <!-- Positioning + impact highlights -->
        <div class="row">
          <div class="col-12 col-lg-7">
            <template v-if="!personalData.data.value">
              <AppSkeleton :lines="6" />
            </template>
            <template v-else>
              <div class="d-block d-sm-none mb-4">
                <NuxtImg :src="info?.profileImageUrl || '/img/blog/edited_pp.jpg'" class="img-fluid main-img-mobile" alt="Dhamodhara Kannan (DK), full stack engineer" width="270" height="270" format="webp" quality="85" loading="lazy" />
              </div>

              <p v-if="info?.currentRole" class="about-role open-sans-font">{{ info.currentRole }}</p>
              <p class="about-bio open-sans-font">{{ info?.bio }}</p>
              <p v-if="info?.focus" class="about-focus open-sans-font">{{ info.focus }}</p>

              <ul class="about-meta list-unstyled open-sans-font">
                <li v-if="info?.city">
                  <i class="fa fa-map-marker" aria-hidden="true"></i> {{ info.city }}
                </li>
                <li v-if="info?.email">
                  <i class="fa fa-envelope-open" aria-hidden="true"></i>
                  <a :href="'mailto:' + info.email">{{ info.email }}</a>
                </li>
                <li v-if="info?.linkedinUrl">
                  <i class="fa fa-linkedin" aria-hidden="true"></i>
                  <a :href="info.linkedinUrl" target="_blank" rel="noopener">LinkedIn</a>
                </li>
                <li v-if="info?.githubUrl">
                  <i class="fa fa-github" aria-hidden="true"></i>
                  <a :href="info.githubUrl" target="_blank" rel="noopener">GitHub</a>
                </li>
              </ul>

              <div class="about-actions">
                <a :href="info?.cvUrl || '/assets/resume/DK_resume.pdf'" target="_blank" rel="noopener" class="btn btn-download">Download CV</a>
                <NuxtLink to="/contact" class="about-secondary-link" data-track="cta_get_in_touch">Get in touch</NuxtLink>
              </div>
            </template>
          </div>

          <!-- Impact highlights -->
          <div v-if="highlightList.length" class="col-12 col-lg-5 mt-5 mt-lg-0">
            <h2 class="text-uppercase custom-title mb-0 ft-wt-600 pb-4">Selected impact</h2>
            <ul class="highlight-list list-unstyled">
              <li v-for="h in highlightList" :key="h.id" class="highlight">
                <span class="highlight__value poppins-font">{{ h.value }}</span>
                <span class="highlight__label open-sans-font">{{ h.label }}</span>
              </li>
            </ul>
          </div>
        </div>

        <hr class="separator" />

        <!-- Skills, grouped -->
        <div class="row">
          <div class="col-12">
            <h2 class="text-uppercase pb-4 pb-sm-5 mb-3 mb-sm-0 text-left text-sm-center custom-title ft-wt-600">What I work with</h2>
          </div>
          <template v-if="!skillsFetch.data.value">
            <div class="col-12"><AppSkeleton :lines="3" /></div>
          </template>
          <template v-else>
            <div v-for="group in skillGroups" :key="group.category" class="col-12 col-md-6 mb-4">
              <h3 class="skill-group-title text-uppercase open-sans-font">{{ group.category }}</h3>
              <ul class="skill-tags list-unstyled">
                <li v-for="skill in group.items" :key="skill.id" class="skill-tag open-sans-font">
                  {{ skill.name }}
                </li>
              </ul>
            </div>
          </template>
        </div>

        <hr class="separator mt-1" />

        <!-- Experience & Education -->
        <div class="row">
          <div class="col-12">
            <h2 class="text-uppercase pb-5 mb-0 text-left text-sm-center custom-title ft-wt-600">
              Experience <span>&</span> Education
            </h2>
          </div>

          <div class="col-12 col-lg-6">
            <h3 class="resume-col-title text-uppercase open-sans-font mb-4">
              <i class="fa fa-briefcase mr-2" aria-hidden="true"></i> Work Experience
            </h3>
            <div class="resume-box">
              <ul>
                <li v-for="exp in workList" :key="exp.id">
                  <div class="icon"><i class="fa fa-briefcase" aria-hidden="true"></i></div>
                  <span class="time open-sans-font text-uppercase">{{ exp.year }}</span>
                  <h4 class="poppins-font text-uppercase">{{ exp.title }}</h4>
                  <p class="open-sans-font mb-1">{{ exp.company }}</p>
                  <p v-if="exp.description" class="open-sans-font resume-desc">{{ exp.description }}</p>
                </li>
              </ul>
            </div>
          </div>

          <div class="col-12 col-lg-6 mt-5 mt-lg-0">
            <h3 class="resume-col-title text-uppercase open-sans-font mb-4">
              <i class="fa fa-graduation-cap mr-2" aria-hidden="true"></i> Education
            </h3>
            <div class="resume-box">
              <ul>
                <li v-for="exp in eduList" :key="exp.id">
                  <div class="icon"><i class="fa fa-graduation-cap" aria-hidden="true"></i></div>
                  <span class="time open-sans-font text-uppercase">{{ exp.year }}</span>
                  <h4 class="poppins-font text-uppercase">{{ exp.title }}</h4>
                  <p class="open-sans-font mb-1">{{ exp.company }}</p>
                  <p v-if="exp.description" class="open-sans-font resume-desc">{{ exp.description }}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const BASE = SITE_URL

const [personalData, skillsFetch, experienceFetch] = await Promise.all([
  useFetch('/api/content/personal'),
  useFetch('/api/content/skills'),
  useFetch('/api/content/experience'),
])

const info = computed(() => (personalData.data.value as any)?.info)
const highlightList = computed(() => (personalData.data.value as any)?.highlights || [])
const skillsList = computed(() => (skillsFetch.data.value as any[]) || [])
const experienceList = computed(() => (experienceFetch.data.value as any[]) || [])

const workList = computed(() => experienceList.value.filter((e: any) => e.type === 'work'))
const eduList = computed(() => experienceList.value.filter((e: any) => e.type === 'education'))

// Preserve the admin's sortOrder for both the groups and the tags inside them.
const skillGroups = computed(() => {
  const groups: { category: string; items: any[] }[] = []
  for (const skill of skillsList.value) {
    const category = skill.category || 'Other'
    let group = groups.find((g) => g.category === category)
    if (!group) {
      group = { category, items: [] }
      groups.push(group)
    }
    group.items.push(skill)
  }
  return groups
})

const ogImage = computed(() => {
  const img = info.value?.profileImageUrl || '/img/blog/edited_pp.jpg'
  return img.startsWith('http') ? img : `${BASE}${img}`
})

const seoTitle = 'About Dhamodhara Kannan (DK) — Full Stack Engineer in Chennai'
const seoDescription = computed(() =>
  metaDescription(
    info.value?.bio ||
      'Who is Dhamodhara Kannan (DK)? A full-stack software engineer in Chennai working across .NET, Node.js, Java, React and TypeScript. Skills, experience and education.',
  ),
)

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ...socialMeta({
    title: seoTitle,
    description: seoDescription.value,
    url: `${BASE}/about`,
    image: ogImage.value,
    type: 'profile',
  }),
})

useHead({
  bodyAttrs: { class: 'about' },
  link: [{ rel: 'canonical', href: `${BASE}/about` }],
  script: [
    // ProfilePage tells a search engine this page *is about a person* rather
    // than being an ordinary page that happens to mention one — the clearest
    // signal available for name queries.
    {
      type: 'application/ld+json',
      innerHTML: computed(() =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          '@id': `${BASE}/about#profilepage`,
          url: `${BASE}/about`,
          name: seoTitle,
          description: seoDescription.value,
          inLanguage: 'en',
          isPartOf: { '@id': `${SITE_URL}/#website` },
          mainEntity: personSchema({
            info: info.value,
            skills: skillsList.value,
            experience: experienceList.value,
            image: ogImage.value,
          }),
        }),
      ),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ]),
      ),
    },
  ],
})
</script>
