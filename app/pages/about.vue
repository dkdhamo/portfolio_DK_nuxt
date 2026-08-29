<template>
  <div>
    <!-- Page Title -->
    <section class="title-section text-left text-sm-center reveal">
      <h1>ABOUT <span>ME</span></h1>
      <span class="title-bg">Resume</span>
    </section>

    <!-- Main Content -->
    <section class="main-content reveal">
      <div class="container">

        <!-- Personal Info + Stats -->
        <div class="row">
          <!-- Personal Info -->
          <div class="col-12 col-lg-5 col-xl-6">
            <template v-if="!personalData.data.value">
              <AppSkeleton :lines="6" />
            </template>
            <template v-else>
              <div class="row">
                <div class="col-12">
                  <h3 class="text-uppercase custom-title mb-0 ft-wt-600">personal infos</h3>
                </div>
                <div class="col-12 d-block d-sm-none">
                  <NuxtImg :src="info?.profileImageUrl || '/img/blog/edited_pp.jpg'" class="img-fluid main-img-mobile" alt="Profile photo" width="270" height="270" format="webp" quality="85" loading="lazy" />
                </div>
                <div class="col-6">
                  <ul class="about-list list-unstyled open-sans-font">
                    <li><span class="title">first name :</span> <span class="value d-block d-sm-inline-block d-lg-block d-xl-inline-block">{{ info?.firstName }}</span></li>
                    <li><span class="title">last name :</span> <span class="value d-block d-sm-inline-block d-lg-block d-xl-inline-block">{{ info?.lastName }}</span></li>
                    <li><span class="title">City :</span> <span class="value d-block d-sm-inline-block d-lg-block d-xl-inline-block">{{ info?.city }}</span></li>
                  </ul>
                </div>
                <div class="col-6">
                  <ul class="about-list list-unstyled open-sans-font">
                    <li><span class="title">Email :</span> <span class="value d-block d-sm-inline-block d-lg-block d-xl-inline-block">{{ info?.email }}</span></li>
                    <li><span class="title">Phone :</span> <span class="value d-block d-sm-inline-block d-lg-block d-xl-inline-block">{{ info?.phone }}</span></li>
                    <li><span class="title">Language :</span> <span class="value d-block d-sm-inline-block d-lg-block d-xl-inline-block">{{ info?.language }}</span></li>
                  </ul>
                </div>
                <div class="col-12 mt-3">
                  <a :href="info?.cvUrl || '/assets/resume/DK_resume_new_temp.pdf'" target="_blank" class="btn btn-download">Download CV</a>
                </div>
              </div>
            </template>
          </div>

          <!-- Stats Boxes with count-up -->
          <div ref="statsSection" class="col-12 col-lg-7 col-xl-6 mt-5 mt-lg-0">
            <div class="row">
              <div class="col-6">
                <div class="box-stats">
                  <h3 class="poppins-font position-relative" :aria-label="`${yearsTarget} years of experience`">{{ yearsCount.displayed.value }}</h3>
                  <p class="open-sans-font m-0 position-relative text-uppercase" aria-hidden="true">years of <span class="d-block">experience</span></p>
                </div>
              </div>
              <div class="col-6">
                <div class="box-stats">
                  <h3 class="poppins-font position-relative" :aria-label="`${projectsTarget} completed projects`">{{ projectsCount.displayed.value }}</h3>
                  <p class="open-sans-font m-0 position-relative text-uppercase" aria-hidden="true">completed <span class="d-block">projects</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr class="separator" />

        <!-- Skills -->
        <div class="row">
          <div class="col-12">
            <h3 class="text-uppercase pb-4 pb-sm-5 mb-3 mb-sm-0 text-left text-sm-center custom-title ft-wt-600">My Skills</h3>
          </div>
          <template v-if="!skillsFetch.data.value">
            <div class="col-12"><AppSkeleton :lines="3" /></div>
          </template>
          <template v-else>
            <div class="col-12">
              <ul class="skill-tags list-unstyled">
                <li v-for="skill in skillsList" :key="skill.id" class="skill-tag open-sans-font">
                  {{ skill.name }}
                </li>
              </ul>
            </div>
          </template>
        </div>

        <hr class="separator mt-1" />

        <!-- Experience & Education — split into two columns -->
        <div class="row">
          <div class="col-12">
            <h3 class="text-uppercase pb-5 mb-0 text-left text-sm-center custom-title ft-wt-600">
              Experience <span>&</span> Education
            </h3>
          </div>

          <!-- Work Experience -->
          <div class="col-12 col-lg-6">
            <h4 class="resume-col-title text-uppercase open-sans-font mb-4">
              <i class="fa fa-briefcase mr-2" aria-hidden="true"></i> Work Experience
            </h4>
            <div class="resume-box">
              <ul>
                <li v-for="exp in workList" :key="exp.id">
                  <div class="icon"><i class="fa fa-briefcase" aria-hidden="true"></i></div>
                  <span class="time open-sans-font text-uppercase">{{ exp.year }}</span>
                  <h5 class="poppins-font text-uppercase">{{ exp.title }}</h5>
                  <p class="open-sans-font mb-1">{{ exp.company }}</p>
                  <p v-if="exp.description" class="open-sans-font resume-desc">{{ exp.description }}</p>
                </li>
              </ul>
            </div>
          </div>

          <!-- Education -->
          <div class="col-12 col-lg-6 mt-5 mt-lg-0">
            <h4 class="resume-col-title text-uppercase open-sans-font mb-4">
              <i class="fa fa-graduation-cap mr-2" aria-hidden="true"></i> Education
            </h4>
            <div class="resume-box">
              <ul>
                <li v-for="exp in eduList" :key="exp.id">
                  <div class="icon"><i class="fa fa-graduation-cap" aria-hidden="true"></i></div>
                  <span class="time open-sans-font text-uppercase">{{ exp.year }}</span>
                  <h5 class="poppins-font text-uppercase">{{ exp.title }}</h5>
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
const BASE = 'https://dkthecoder.online'

const [personalData, skillsFetch, experienceFetch] = await Promise.all([
  useFetch('/api/content/personal'),
  useFetch('/api/content/skills'),
  useFetch('/api/content/experience'),
])

const info = computed(() => (personalData.data.value as any)?.info)
const statsData = computed(() => (personalData.data.value as any)?.stats)
const skillsList = computed(() => (skillsFetch.data.value as any[]) || [])
const experienceList = computed(() => (experienceFetch.data.value as any[]) || [])

const workList = computed(() => experienceList.value.filter((e: any) => e.type === 'work'))
const eduList = computed(() => experienceList.value.filter((e: any) => e.type === 'education'))

const ogImage = computed(() => {
  const img = info.value?.profileImageUrl || '/img/blog/edited_pp.jpg'
  return img.startsWith('http') ? img : `${BASE}${img}`
})

useSeoMeta({
  title: 'About Dhamodhara Kannan (DK) – Software Engineer | Skills & Experience',
  description: computed(() => info.value?.bio || 'Learn about Dhamodhara Kannan (DK) – a full-stack software engineer. Explore skills, work experience, and education.'),
  keywords: 'Dhamodhara Kannan, DK, DK software engineer, Dhamodhara Kannan developer, full stack developer, software engineer skills, web developer experience',
  ogTitle: 'About Dhamodhara Kannan (DK) – Software Engineer | Skills & Experience',
  ogDescription: computed(() => info.value?.bio || 'Learn about Dhamodhara Kannan (DK) – a full-stack software engineer. Explore skills, work experience, and education.'),
  ogUrl: `${BASE}/about`,
  ogImage,
  twitterCard: 'summary_large_image',
  twitterImage: ogImage,
})
useHead({
  bodyAttrs: { class: 'about' },
  link: [{ rel: 'canonical', href: `${BASE}/about` }],
})

// Stat counters
const statsSection = ref<HTMLElement | null>(null)
const yearsTarget = computed(() => Number(statsData.value?.yearsExperience) || 0)
const projectsTarget = computed(() => Number(statsData.value?.completedProjects) || 0)

const yearsCount = useCountUp(statsSection, yearsTarget)
const projectsCount = useCountUp(statsSection, projectsTarget)
</script>
