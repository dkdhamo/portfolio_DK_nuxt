<template>
  <div>
    <section class="title-section text-left text-sm-center reveal">
      <h1>my <span>work</span></h1>
    </section>

    <section class="main-content reveal">
      <div class="container">
        <p class="pf-intro open-sans-font">
          A few things I've built end to end — the problem, what I did about it, and what changed.
        </p>

        <div class="pf-filter-bar">
          <button
            v-for="cat in categories"
            :key="cat"
            class="pf-filter-btn"
            :class="{ active: activeFilter === cat }"
            @click="activeFilter = cat"
          >
            {{ cat }}
          </button>
        </div>

        <TransitionGroup tag="ul" name="grid-item" class="pf-cards list-unstyled row">
          <li v-for="(project, i) in filteredList" :key="project.id" class="col-12 col-md-6">
            <NuxtLink :to="`/portfolio/${project.slug}`" class="pf-card" :data-track="`case_study:${project.slug}`">
              <div class="pf-card__media">
                <AppProjectImage
                  :src="project.thumbnailUrl"
                  :alt="`${project.title} cover image`"
                  :width="640"
                  :height="400"
                  :loading="i < 2 ? 'eager' : 'lazy'"
                  :fetchpriority="i === 0 ? 'high' : 'auto'"
                />
              </div>
              <div class="pf-card__body">
                <span class="pf-card__type open-sans-font">{{ project.projectType }}<template v-if="project.year"> · {{ project.year }}</template></span>
                <h2 class="pf-card__title poppins-font">{{ project.title }}</h2>
                <p v-if="project.summary" class="pf-card__summary open-sans-font">{{ project.summary }}</p>
                <p v-if="project.outcome" class="pf-card__outcome open-sans-font">{{ project.outcome }}</p>
                <span class="pf-card__cta open-sans-font">Read case study <span aria-hidden="true">&rarr;</span></span>
              </div>
            </NuxtLink>
          </li>
        </TransitionGroup>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const BASE = SITE_URL

const { data } = await useFetch('/api/projects')
const projectList = computed(() => (data.value as any[]) || [])

const seoTitle = 'Projects & Case Studies — Dhamodhara Kannan (DK), Full Stack Engineer'
const seoDescription = metaDescription(
  'Engineering case studies by Dhamodhara Kannan (DK): an agentic MCP server for Azure DevOps, a RAG knowledge assistant, and a Java EE to Spring Boot migration — each with the problem, the build and the measured outcome.',
)

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ...socialMeta({
    title: seoTitle,
    description: seoDescription,
    url: `${BASE}/portfolio`,
    image: absoluteUrl('/img/blog/edited_pp.jpg'),
  }),
})

useHead({
  bodyAttrs: { class: 'portfolio' },
  link: [{ rel: 'canonical', href: `${BASE}/portfolio` }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': `${BASE}/portfolio#collection`,
          url: `${BASE}/portfolio`,
          name: seoTitle,
          description: seoDescription,
          inLanguage: 'en',
          isPartOf: { '@id': `${SITE_URL}/#website` },
          about: { '@id': `${SITE_URL}/#person` },
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: projectList.value.length,
            itemListElement: projectList.value.map((p: any, i: number) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `${BASE}/portfolio/${p.slug}`,
              name: p.title,
            })),
          },
        }),
      ),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Work', path: '/portfolio' },
        ]),
      ),
    },
  ],
})

const activeFilter = ref('All')
const categories = computed(() => {
  const types = projectList.value.map((p: any) => p.projectType).filter(Boolean)
  return ['All', ...Array.from(new Set<string>(types))]
})
const filteredList = computed(() =>
  activeFilter.value === 'All'
    ? projectList.value
    : projectList.value.filter((p: any) => p.projectType === activeFilter.value)
)
</script>
