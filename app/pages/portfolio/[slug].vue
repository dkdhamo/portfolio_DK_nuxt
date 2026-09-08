<template>
  <div>
    <section class="title-section title-section--case-study text-left text-sm-center reveal">
      <h1>{{ project.title }}</h1>
    </section>

    <section class="main-content reveal">
      <div class="container">
        <NuxtLink to="/portfolio" class="cs-back open-sans-font">
          <span aria-hidden="true">&larr;</span> All work
        </NuxtLink>

        <div class="row">
          <!-- Case study body -->
          <div class="col-12 col-lg-8">
            <p v-if="project.summary" class="cs-summary open-sans-font">{{ project.summary }}</p>

            <template v-if="project.problem">
              <h2 class="cs-heading text-uppercase custom-title ft-wt-600">The problem</h2>
              <p class="open-sans-font cs-body">{{ project.problem }}</p>
            </template>

            <template v-if="project.approach">
              <h2 class="cs-heading text-uppercase custom-title ft-wt-600">What I built</h2>
              <p class="open-sans-font cs-body">{{ project.approach }}</p>
            </template>

            <template v-if="project.outcome">
              <h2 class="cs-heading text-uppercase custom-title ft-wt-600">Outcome</h2>
              <p class="open-sans-font cs-body cs-body--outcome">{{ project.outcome }}</p>
            </template>
          </div>

          <!-- Fact sheet -->
          <aside class="col-12 col-lg-4 mt-4 mt-lg-0">
            <div class="cs-facts open-sans-font">
              <dl>
                <div class="cs-fact">
                  <dt>Type</dt>
                  <dd>{{ project.projectType }}</dd>
                </div>
                <div v-if="project.client" class="cs-fact">
                  <dt>Context</dt>
                  <dd>{{ project.client }}</dd>
                </div>
                <div v-if="project.year" class="cs-fact">
                  <dt>Year</dt>
                  <dd>{{ project.year }}</dd>
                </div>
                <div v-if="project.tools" class="cs-fact">
                  <dt>Stack</dt>
                  <dd>{{ project.tools }}</dd>
                </div>
              </dl>

              <div v-if="isLiveLink || project.repoUrl" class="cs-links">
                <a v-if="isLiveLink" :href="project.previewUrl" target="_blank" rel="noopener" class="btn btn-download" :data-track="`live_demo:${slug}`">
                  View live
                </a>
                <a v-if="project.repoUrl" :href="project.repoUrl" target="_blank" rel="noopener" class="cs-repo" :data-track="`repo:${slug}`">
                  <i class="fa fa-github" aria-hidden="true"></i> Source code
                </a>
              </div>
            </div>
          </aside>
        </div>

        <!-- Gallery -->
        <div v-if="gallery.length" class="cs-gallery">
          <figure v-for="(img, i) in gallery" :key="img" class="cs-gallery__item">
            <AppProjectImage
              :src="img"
              :alt="`${project.title} — screen ${i + 1}`"
              :width="1000"
              :height="620"
              :quality="82"
              :loading="i === 0 ? 'eager' : 'lazy'"
            />
          </figure>
        </div>

        <!-- Next project -->
        <div v-if="nextProject" class="cs-next">
          <span class="open-sans-font cs-next__label">Next</span>
          <NuxtLink :to="`/portfolio/${nextProject.slug}`" class="cs-next__link poppins-font">
            {{ nextProject.title }} <span aria-hidden="true">&rarr;</span>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const BASE = SITE_URL
const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data, error } = await useFetch(() => `/api/projects/${slug.value}`)

if (error.value || !data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

const project = computed(() => data.value as any)

// Only treat previewUrl as a live demo when it points at a site, not an image file.
const isLiveLink = computed(() => {
  const url: string = project.value?.previewUrl || ''
  return /^https?:\/\//.test(url) && !/\.(png|jpe?g|gif|webp|avif|svg)(\?|$)/i.test(url)
})

const gallery = computed((): string[] => {
  try {
    const parsed = JSON.parse(project.value?.images ?? '[]')
    return Array.isArray(parsed) ? parsed.filter(Boolean) : []
  } catch {
    return []
  }
})

// "Next" link, so a reader who finishes one case study has somewhere to go.
// The API computes this alongside the project row, so it doesn't cost a
// second round trip fetching every other project's full case-study body.
const nextProject = computed(() => project.value?.next ?? null)

const ogImage = computed(() => {
  const img = project.value?.thumbnailUrl || '/img/blog/edited_pp.jpg'
  return img.startsWith('http') ? img : `${BASE}${img}`
})

// Title reads "<Project> — <Type> Case Study by Dhamodhara Kannan (DK)":
// the project name is what someone searches, the rest carries the name and
// the category without repeating boilerplate across every case study.
const seoTitle = computed(
  () => `${project.value.title} — ${project.value.projectType} Case Study by Dhamodhara Kannan (DK)`,
)

const seoDescription = computed(() =>
  metaDescription(
    project.value.summary ||
      [project.value.title, project.value.outcome].filter(Boolean).join(' — ') ||
      `${project.value.title}, a project by Dhamodhara Kannan (DK), full-stack engineer.`,
  ),
)

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ...socialMeta({
    title: seoTitle.value,
    description: seoDescription.value,
    url: `${BASE}/portfolio/${slug.value}`,
    image: ogImage.value,
    type: 'article',
  }),
})

useHead({
  bodyAttrs: { class: 'portfolio' },
  link: [{ rel: 'canonical', href: computed(() => `${BASE}/portfolio/${slug.value}`) }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          '@id': `${BASE}/portfolio/${slug.value}#work`,
          name: project.value.title,
          headline: project.value.title,
          description: seoDescription.value,
          url: `${BASE}/portfolio/${slug.value}`,
          image: ogImage.value,
          inLanguage: 'en',
          isPartOf: { '@id': `${SITE_URL}/#website` },
          // Both author and creator point at the same Person node so every
          // case study reinforces the one entity rather than creating new ones.
          author: { '@id': `${SITE_URL}/#person` },
          creator: { '@id': `${SITE_URL}/#person` },
          ...(project.value.year ? { dateCreated: String(project.value.year) } : {}),
          ...(project.value.tools
            ? { keywords: String(project.value.tools).split(',').map((t: string) => t.trim()).filter(Boolean) }
            : {}),
          ...(project.value.projectType ? { genre: project.value.projectType } : {}),
        }),
      ),
    },
    {
      type: 'application/ld+json',
      innerHTML: computed(() =>
        JSON.stringify(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/portfolio' },
            { name: project.value.title, path: `/portfolio/${slug.value}` },
          ]),
        ),
      ),
    },
  ],
})
</script>
