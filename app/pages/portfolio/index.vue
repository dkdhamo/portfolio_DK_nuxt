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
            <NuxtLink :to="`/portfolio/${project.slug}`" class="pf-card">
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
                <h3 class="pf-card__title poppins-font">{{ project.title }}</h3>
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
const BASE = 'https://dkthecoder.online'

useSeoMeta({
  title: 'Work – Dhamodhara Kannan (DK) | Full Stack Engineer Case Studies',
  description: 'Case studies from Dhamodhara Kannan (DK), full-stack engineer: an agentic MCP server for Azure DevOps, a RAG knowledge assistant, a Java EE to Spring Boot migration, and more.',
  keywords: 'Dhamodhara Kannan portfolio, DK portfolio, DK projects, full stack engineer case studies, MCP server, RAG assistant, Spring Boot migration',
  ogTitle: 'Work – Dhamodhara Kannan (DK) | Full Stack Engineer Case Studies',
  ogDescription: 'Case studies from Dhamodhara Kannan (DK), full-stack engineer: agentic AI tooling, RAG systems, API design, and legacy migration.',
  ogUrl: `${BASE}/portfolio`,
  ogImage: `${BASE}/img/blog/edited_pp.jpg`,
  twitterCard: 'summary_large_image',
  twitterImage: `${BASE}/img/blog/edited_pp.jpg`,
})
useHead({
  bodyAttrs: { class: 'portfolio' },
  link: [{ rel: 'canonical', href: `${BASE}/portfolio` }],
})

const { data } = await useFetch('/api/projects')
const projectList = computed(() => (data.value as any[]) || [])

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
